#ifndef _POSE_HPP_
#define _POSE_HPP_ 1

#include <opencv2/core/core.hpp>

class PoseEstimator;
class PoseRefiner;
class Camera;
class Correspondences2D;

class Pose
{
public:

    Pose();

    cv::Mat translation();
    void setTranslation(const cv::Mat &translation);

    // rodrigues rotation vector:
    // http://docs.opencv.org/modules/calib3d/doc/camera_calibration_and_3d_reconstruction.html#void Rodrigues(InputArray src, OutputArray dst, OutputArray jacobian)
    cv::Mat rotation() const;
    void setRotation(const cv::Mat &rotation); ///< set the rotation component of the pose

    std::string toString(unsigned int flag = 0) const;
    double score() const;
    void setScore(double score);
    double lastTimeSeen() const;
    void setLastTimeSeen(double lastTimeSeen);
    bool isEmpty()
    {
        return _isEmpty;
    }
protected:
    cv::Mat _translation;
    cv::Mat _rotation;
    bool _isEmpty;

    double              _score;
    double              _lastTimeSeen;


};



#endif
