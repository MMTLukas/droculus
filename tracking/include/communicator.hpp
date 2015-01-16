#ifndef _Communicator_HPP_
#define _Communicator_HPP_ 1

#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

using namespace std;

class Communicator
{
public:
    Communicator();
    bool open();
    void release();
    bool acceptClient();
    bool send(string message);
    bool isOpen();

protected:
    bool doesSomebodyListen;
    int serverSocketDescriptor;
    int clientSocketDescriptor;
    int port;
    int messageLength;
    struct sockaddr_in serverInfo, clientInfo;
    socklen_t clientInfoLength;
};

#endif
