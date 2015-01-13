cmake_minimum_required(VERSION 2.8)
# based on sstt and
# https://github.com/MasteringOpenCV/code/tree/master/Chapter2_iPhoneAR/Example_MarkerBasedAR/Example_MarkerBasedAR
project(MarkerTrackerBW)
find_package(OpenCV REQUIRED)
include_directories(
	${OpenCV_INCLUDE_DIRS}
	${OpenCV_INCLUDE_DIR}
	)
	
# library	
set(srcsLib 
		src/pose.cpp
		src/markerBW.cpp
		src/markerDetectorBW.cpp)
set(hdrsLib 
		include/pose.hpp
		include/markerBW.hpp
		include/markerDetectorBW.hpp)

set(linkLibsLib ${OpenCV_LIBS})
include_directories(${hdrsLib})
add_library(MarkerTrackerBWLib ${srcsLib} ${hdrsLib})
target_link_libraries(MarkerTrackerBWLib ${linkLibsLib})
# Make sure the compiler can find include files for our library when other libraries or executables link to Hello
target_include_directories(MarkerTrackerBWLib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})


set(srcs	src/main.cpp)
set(linkLibs ${linkLibsLib} MarkerTrackerBWLib)
add_executable(markerTrackerTest ${srcs})
target_link_libraries(markerTrackerTest LINK_PUBLIC	${linkLibs})

