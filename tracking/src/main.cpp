#include <stdio.h>
#include <iostream>
#include <opencv2/opencv.hpp>
#include "include/markerDetectorBW.hpp"
#include "include/markerBW.hpp"

using namespace cv;
using namespace std;

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

        //Start stream from parrot drone
        VideoCapture cap("tcp://192.168.1.1:5555");
        if (!cap.isOpened())
        {
            cerr << "Could not open stream from parrot drone" << endl;
            return -1;
        }

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
            bool bSuccess = cap.read(image); // read a new frame from video
            if (!bSuccess) //if not success, break loop
            {
                cout << "Cannot read a frame from video stream" << endl;
                break;
            }

            md.processFrame(image);
            vector<Pose> poses = md.getPoses();
            if (poses.size() == 1 && poses.at(0).isEmpty() == false)
            {
                stringstream transSS, rotSS;
                transSS << "trans (x,y,z): " << poses.at(0).translation().at<float>(0) << " " << poses.at(0).translation().at<float>(1) << " " << poses.at(0).translation().at<float>(2);
                cv::putText(image, transSS.str(), cv::Point(10, 30), CV_FONT_NORMAL, 0.7, cv::Scalar(0, 255, 0), 1);

                rotSS << "rot (rodrigues): " << poses.at(0).rotation().at<float>(0) << " " << poses.at(0).rotation().at<float>(1) << " " << poses.at(0).rotation().at<float>(2);
                cv::putText(image, rotSS.str(), cv::Point(10, 60), CV_FONT_NORMAL, 0.7, cv::Scalar(0, 255, 0), 1);
            }

            imshow("VideoStream", image);

            if (waitKey(30) == 27) //wait for 'esc' key press for 30ms. If 'esc' key is pressed, break loop
            {
                cout << "esc key is pressed by user" << endl;
                quit = true;
            }
        }

        cap.release();
    }
}
