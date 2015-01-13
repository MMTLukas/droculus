
#include "include/pose.hpp"
#include <sstream>


cv::Mat Pose::translation()
{
	return _translation;
}

void Pose::setTranslation(const cv::Mat &translation)
{
	_translation = translation;
	_isEmpty = false;
}

cv::Mat Pose::rotation() const
{
	return _rotation;
}

void Pose::setRotation(const cv::Mat &rotation)
{
	_rotation = rotation;
	_isEmpty = false;
}

Pose::Pose()
{
	_isEmpty = true;
}

double Pose::score() const
{
    return _score;
}

void Pose::setScore(double score)
{
    _score = score;
}

double Pose::lastTimeSeen() const
{
    return _lastTimeSeen;
}

void Pose::setLastTimeSeen(double lastTimeSeen)
{
    _lastTimeSeen = lastTimeSeen;
}


