#include <stdio.h>
#include <iostream>
#include <opencv2/opencv.hpp>
#include "include/markerDetectorBW.hpp"
#include "include/markerBW.hpp"

using namespace cv;
using namespace std;

int main(int argc, char** argv)
{

    cout << "command line arguments: " << endl;
    // for now hardcode the parameters
    for (int i = 0; i < argc; i++)
    {
        cout << "i " << i << ": " <<  argv[i] << endl;
    }

    cout << argc <<endl;

    if (argc == 3)
    {
        FileStorage fs2(argv[1], FileStorage::READ);
        //FileStorage fs2("camera.yml", FileStorage::READ);
        // get calibration data

        Mat cameraMatrix, distCoeffs;
        fs2["camera_matrix"] >> cameraMatrix;
        fs2["distortion_coefficients"] >> distCoeffs;

        cout << "intrinsics: " << cameraMatrix << endl;
        cout << "distCoeffs: " << distCoeffs << endl;

        VideoCapture cap;
        cap.open("http://localhost:8000/?dummy=param.mjpeg");

        //int cameraId = (int)strtol(argv[1], NULL, 10);
        //cout << "cameraId: " << cameraId << endl;

        //cap.open("bottom_camera.mp4");
        //cap.open(1);
        //cap.set(CV_CAP_PROP_FRAME_WIDTH, 640);
        //cap.set(CV_CAP_PROP_FRAME_HEIGHT, 480);
        //cap.set(CV_CAP_PROP_FPS, 30);

        if (!cap.isOpened())
        {
            cerr << "Could not open capture stream" << atoi(argv[1]) << endl;
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
            //resize(image, image, Size(640, 480), 0, 0, INTER_LINEAR);

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
    else
    {
        cout << "please specify a calibration file and the marker size: e.g. \"calib.yml 8.3\"";
    }
}
