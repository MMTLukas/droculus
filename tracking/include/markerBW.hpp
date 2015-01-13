#ifndef MarkerBW_hpp
#define MarkerBW_hpp

////////////////////////////////////////////////////////////////////
// Standard includes:
#include <vector>
#include <iostream>
#include <opencv2/opencv.hpp>

////////////////////////////////////////////////////////////////////
// File includes:
#include "include/pose.hpp"

/**
 * This class represents a marker
 */
class MarkerBW
{
public:
  MarkerBW();

  friend bool operator<(const MarkerBW &M1,const MarkerBW&M2);
  friend std::ostream & operator<<(std::ostream &str,const MarkerBW &M);

  static cv::Mat rotate(cv::Mat  in);
  static int hammDistMarkerBW(cv::Mat bits);
  static int mat2id(const cv::Mat &bits);
  static int getMarkerBWId(cv::Mat &in,int &nRotations);

public:

  // Id of  the marker
  int id;

  // MarkerBW transformation with regards to the camera
  Pose pose;

  std::vector<cv::Point2f> points;

  // Helper function to draw the marker contour over the image
  void drawContour(cv::Mat& image, cv::Scalar color = CV_RGB(0,250,0)) const;
};

#endif
