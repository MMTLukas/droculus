
#ifndef _MarkerDetectorBW_HPP_
#define _MarkerDetectorBW_HPP_

////////////////////////////////////////////////////////////////////
// Standard includes:
#include <vector>
#include <opencv2/opencv.hpp>

#include "include/pose.hpp"
#include "include/markerBW.hpp"

////////////////////////////////////////////////////////////////////
// File includes:
//#include "BGRAVideoFrame.h"
//#include "CameraCalibration.hpp"

////////////////////////////////////////////////////////////////////
// Forward declaration:
class MarkerBW;

/**
 * A top-level class that encapsulate marker detector algorithm
 */
class MarkerDetectorBW
{
public:
    typedef std::vector<cv::Point>    PointsVector;
    typedef std::vector<PointsVector> ContoursVector;

    /**
     * Initialize a new instance of marker detector object
     * @calibration[in] - Camera calibration (intrinsic and distortion components) necessary for pose estimation.
     */
    //MarkerDetectorBW(CameraCalibration calibration);
    MarkerDetectorBW(cv::Mat cameraMatrix, cv::Mat distCoeffs, float marker3DWidth, float marker3DHeight);

    //! Searches for markes and fills the list of transformation for found markers
    void processFrame(const cv::Mat& frame);

    const std::vector<Pose>& getPoses() const;

protected:

    //! Main marker detection routine
    bool findMarkers(const cv::Mat& frame, std::vector<MarkerBW>& detectedMarkers);

    //! Converts image to grayscale
    void prepareImage(const cv::Mat& bgraMat, cv::Mat& grayscale) const;

    //! Performs binary threshold
    void performThreshold(const cv::Mat& grayscale, cv::Mat& thresholdImg) const;

    //! Detects appropriate contours
    void findContours(cv::Mat& thresholdImg, ContoursVector& contours, int minContourPointsAllowed) const;

    //! Finds marker candidates among all contours
    void findCandidates(const ContoursVector& contours, std::vector<MarkerBW>& detectedMarkers);

    //! Tries to recognize markers by detecting marker code
    void recognizeMarkers(const cv::Mat& grayscale, std::vector<MarkerBW>& detectedMarkers);

    //! Calculates marker poses in 3D
    /// calculates the pose of the camera in the reference frame of the marker (markerCOS)
    /// todo: make optional to also calculate the pose of th emarker in the cameraCIS
    void estimatePosition(std::vector<MarkerBW>& detectedMarkers);

private:
    float _minContourLengthAllowed;

    cv::Size markerImageSize;
    cv::Mat camMatrix;
    cv::Mat distCoeff;
    std::vector<Pose> _transformations;

    cv::Mat _grayscaleImage;
    cv::Mat _thresholdImg;
    cv::Mat _canonicalMarkerImage;

    ContoursVector           _contours;
    std::vector<cv::Point3f> _markerCorners3d;
    std::vector<cv::Point2f> _markerCorners2d;

    float perimeter(const std::vector<cv::Point2f> &a);
    bool isInto(cv::Mat &contour, std::vector<cv::Point2f> &b);
};

#endif
