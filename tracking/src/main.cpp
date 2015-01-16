#include <stdio.h>
#include <iostream>
#include <ctime>

#include <opencv2/opencv.hpp>
#include "include/markerDetectorBW.hpp"
#include "include/markerBW.hpp"
#include "include/communicator.hpp"

using namespace cv;
using namespace std;

float calculateYRotationAngle(float rotationYAxis);

int main(int argc, char** argv)
{
  if (argc != 3)
    {
        cout << "please specify a calibration file and the marker size: e.g. \"calib.yml 8.3\"";
        cout << "command line arguments: " << endl;
        for (int i = 0; i < argc; i++)
        {
            cout << "i " << i << ": " <<  argv[i] << endl;
        }
    }
    else
    {
        //Read camera calibration file and define needed matrizen
        FileStorage fs2(argv[1], FileStorage::READ);
        Mat cameraMatrix, distCoeffs;
        fs2["camera_matrix"] >> cameraMatrix;
        fs2["distortion_coefficients"] >> distCoeffs;

        cout << "Trying to open stream at 192.168.1.1:5555 ..." << endl;

        //Start stream from parrot drone
        VideoCapture cap("tcp://192.168.1.1:5555");
        if (!cap.isOpened())
        {
            cerr << "Could not open stream from drone" << endl;
            return -1;
        }
        else
        {
            cout << "Opened stream from drone" << endl;
        }

        //Descriptors per socket
        Communicator socket;
        socket.open();

        //float markerSize = strtof(argv[3], NULL);
        double markerSize = atof(argv[2]);
        cout << "marker size: " << markerSize << endl;;
        cout << "marker size float:" << (float)markerSize << endl;

        // specify marker size in the same units as used for the camera calibration
        MarkerDetectorBW  md(cameraMatrix, distCoeffs, markerSize, markerSize);
        cv::namedWindow("VideoStream", CV_WINDOW_NORMAL);

        double dWidth = cap.get(CV_CAP_PROP_FRAME_WIDTH);
        double dHeight = cap.get(CV_CAP_PROP_FRAME_HEIGHT);
        Size frameSize(static_cast<int>(dWidth), static_cast<int>(dHeight));

        Mat image;
        bool quit = false;
        while (!quit)
        {
            socket.getClient();

            //Read frame
            bool bSuccess = cap.read(image);
            if (!bSuccess)
            {
                cout << "Cannot read a frame from video stream" << endl;
                break;
            }

            //Process image and find marker
            md.processFrame(image);
            vector<Pose> poses = md.getPoses();
            if (poses.size() == 1 && poses.at(0).isEmpty() == false)
            {
                stringstream transSS, rotSS, bufferSS;
                float tx, ty, tz;
                float rx, ry, rz;

                tx = poses.at(0).translation().at<float>(0);
                ty = poses.at(0).translation().at<float>(1);
                tz = poses.at(0).translation().at<float>(2);

                rx = poses.at(0).rotation().at<float>(0);
                ry = poses.at(0).rotation().at<float>(1);
                rz = poses.at(0).rotation().at<float>(2);

                transSS << "trans (x,y,z): " << tx << " " << ty << " " << tz;
                cv::putText(image, transSS.str(), cv::Point(10, 30), CV_FONT_NORMAL, 0.7, cv::Scalar(0, 255, 0), 1);

                rotSS << "rot (rodrigues): " << rx << " " << ry << " " << rz;
                cv::putText(image, rotSS.str(), cv::Point(10, 60), CV_FONT_NORMAL, 0.7, cv::Scalar(0, 255, 0), 1);

				
				//get the rotation-value for the y-axis
				float rotationOnYAxis = calculateYRotationAngle(ry);
				
                //Send trans and rot via sockets
                bufferSS << "TX=" << tx << "&TY=" << ty << "&TZ=" << tz << "&rotationOnYAxis=" << rotationOnYAxis;
                socket.send(bufferSS.str());
            }

            //Show Image
            imshow("VideoStream", image);

            //Cancel at esc for 30ms
            if (waitKey(1) == 27)
            {
                cout << "esc key is pressed by user" << endl;
                quit = true;
            }
        }

        //Release socket and video stream
        socket.release();
        cap.release();
    }
    return 0;
}

// a clockwise rotation between 0° and 180° is similar to a rotation value (from the marker-tracking) between 0 and 3
// so to get the right rotation-angle use the rotation-value and calculate the right angle
// for negative values due to a counterclockwise rotation do the same
// but only transmit the angle, if it is not lower than -70 degrees or higher than 70 degrees
float calculateYRotationAngle(float rotationYAxis)
{
	float normedRotationValue = normedRotationValue = (3.0 / 180);
	float calculatedRotationAngleYAxis = (rotationYAxis / normedRotationValue);
	float rotateInYDirection;

	if (calculatedRotationAngleYAxis < -70 || calculatedRotationAngleYAxis > 70)
	{
		rotateInYDirection = 0;
	}
	else if (-70 < calculatedRotationAngleYAxis && calculatedRotationAngleYAxis < 0)
	{
		// rotate counterclockwise, if the absolute angle-value is higher than 180 degrees the ardrone-autonomy rotates in the opposite direction
		// that means, a rotation in counterclockwise direction by 10 degrees has to be written as a rotation by 350 degrees
		rotateInYDirection = (360.0 + calculatedRotationAngleYAxis);
	}
	else
	{
		// rotate clockwise when rotationAngleYAxis > 0
		rotateInYDirection = calculatedRotationAngleYAxis;
	}

	return rotateInYDirection;
}
