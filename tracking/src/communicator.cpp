#include "include/communicator.hpp"

bool Communicator::open()
{
    //Binds socket to address
    int result = bind(serverSocketDescriptor, (struct sockaddr*) &serverInfo, sizeof(serverInfo));
    if(result < 0)
    {
        cerr << "ERROR on binding" << endl;
        return 0;
    }

    //Listen for incoming connections
    listen(serverSocketDescriptor, SOMAXCONN);
    clientInfoLength = sizeof(clientInfo);

    cout << "OPENED SOCKET" << endl;
    return 1;
}

//Accept causes the process to block until there is a client connecting
bool Communicator::acceptClient()
{
    if(doesSomebodyListen){
        //TODO: Check if connection is still there
        //if not set doesSomebodyListen = false
        return 0;
    }

    clientSocketDescriptor = accept(serverSocketDescriptor, (struct sockaddr*) &clientInfo, &clientInfoLength);
    doesSomebodyListen = true;
    if(clientSocketDescriptor < 0)
    {
        cerr << "ERROR on accept" << endl;
        doesSomebodyListen = false;
        return 0;
    }

    cout << "ACCEPTED CLIENT" << endl;
    send("START");
    return 1;
}

bool Communicator::send(string message)
{
    if(!doesSomebodyListen){
        return 0;
    }

    messageLength = write(clientSocketDescriptor, message.c_str(), strlen(message.c_str()));
    if (messageLength < 0)
    {
        cerr << "ERROR on write" << endl;
        return 0;
    }
    else{
        cout << "SEND: " << message.c_str() << endl;
    }

    return 1;
}

void Communicator::release(){
    close(serverSocketDescriptor);
    close(clientSocketDescriptor);
}

Communicator::Communicator()
{
    doesSomebodyListen = false;

    //Create TCP stream socket for listening
    serverSocketDescriptor = socket(AF_INET, SOCK_STREAM, 0);
    if(serverSocketDescriptor < 0)
    {
        cerr << "ERROR on opening socket" << endl;
    }

    //Initialize to zero and set the address-family, (current) ip address and port
    bzero((char*) &serverInfo, sizeof(serverInfo));
    port = 3333;
    serverInfo.sin_family = AF_INET;
    serverInfo.sin_addr.s_addr = INADDR_ANY;
    serverInfo.sin_port = htons(port);
}

