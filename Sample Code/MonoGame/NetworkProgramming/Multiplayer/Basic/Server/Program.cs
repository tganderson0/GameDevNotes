using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class Program
    {
        private static Predicate<string> PortParam = (arg => arg == "-p" || arg == "--port" || arg == "-port");
        private const string EOM = "<EOM>";

        /*
         * Allow any number of clients to connect.
         * Report a message each time a client connects or disconnects, along with whatever name the server assigns to the client
         * The client should have a command line interface where something can be typed in, that message send it to the server, have the server print it out (identifying which client the message came from).  The server sends a message back to the client ack’ing the message, and the client prints out the ack from the server.
        */
        static int Main(string[] args)
        {

            if (readArgs(args, out ushort port))
            {
                executeServer(port);
            }

            return 0;
        }

        static bool readArgs(string[] args, out ushort port)
        {
            port = 0;
            bool validArgs = true;
            if (args.Length != 2)
            {
                Console.WriteLine("Error: Expected argument for port parameter.");
                validArgs = false;
            }
            else if (!PortParam(args[0].ToLower()))
            {
                Console.WriteLine("Error: Expected argument for port parameter.");
                validArgs = false;
            }
            else
            {
                if (!ushort.TryParse(args[1], out port))
                {
                    Console.WriteLine("Error: Invalid port number {0}", args[1]);
                    validArgs = false;
                }
            }

            return validArgs;
        }

        public static void executeServer(ushort port)
        {
            HashSet<Socket> clients = new HashSet<Socket>();
            List<Socket> remove = new List<Socket>(); 
            Dictionary<Socket, string> clientMessages = new Dictionary<Socket, string>();
            Dictionary<Socket, string> clientNames = new Dictionary<Socket, string>();
            var commandMap = buildCommandMap();

            try
            {
                var listener = setupServerListener(port);

                Console.WriteLine("Waiting for a client to connect...");

                // Start an async task to accept a client.
                waitForClientConnection(listener, clients, clientMessages, clientNames);

                // OMG, I did it again, two times in one program!
                // Without question, a graceful exit would be better.  Server could have a command line
                // interface where user can enter commands, including a 'quit' that would perform a
                // graceful shutdown.
                while (true)    
                {
                    lock (listener)
                    {
                        foreach (var client in clients)
                        {
                            if (client.Available > 0)
                            {
                                // Receive the data on the socket if there is any available.
                                byte[] buffer = new byte[client.Available];
                                try
                                {
                                    client.Receive(buffer);
                                }
                                catch (SocketException se)
                                {
                                    // If there's an error in receiving then print it
                                    Console.WriteLine(se.ToString());

                                    // Remove the client if it is no longer connected (maybe because of the exception)
                                    if (!client.Connected)
                                    {
                                        Console.WriteLine("{0} disconnected", clientNames[client]);
                                        remove.Add(client);
                                        continue;
                                    }
                                }

                                clientMessages[client] += Encoding.ASCII.GetString(buffer);

                                // Wait to process the message until <EOM> has been received
                                // Note: Ideally find a way to track this as bytes are read, rather than
                                //       doing the search each time over the whole message.
                                if (clientMessages[client].Contains(EOM))
                                {
                                    if (!handleClientMessage(commandMap, clients, client, clientMessages, clientNames[client]))
                                    {
                                        remove.Add(client);
                                    }
                                }
                            }
                        }

                        //
                        // Remove any disconnected clients
                        foreach (var client in remove)
                        {
                            clients.Remove(client);
                            clientNames.Remove(client);
                            clientMessages.Remove(client);
                        }
                        remove.Clear();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        /// <summary>
        /// Demonstrates how to build a command map that reponse to the different message types.  The use
        /// of a command map keeps the code from having a long series of if-else or swtich statements in the code
        /// resulting in easier to and more maintainable code.
        /// </summary>
        /// <returns></returns>
        private static Dictionary<string, Func<Socket, string, HashSet<Socket>, string, bool>> buildCommandMap()
        {
            Dictionary<string, Func<Socket, string, HashSet<Socket>, string, bool>> map = new Dictionary<string, Func<Socket, string, HashSet<Socket>, string, bool>>();

            map.Add("who", (client, clientName, clients, message) =>
            {
                client.Send(handleWhoRequest(clients, client));

                return true;
            });

            map.Add("quit", (client, clientName, clients, message) =>
            {
                client.Send(Encoding.ASCII.GetBytes("bye"));
                client.Shutdown(SocketShutdown.Both);
                client.Close();
                Console.WriteLine("{0} disconnected", clientName);

                return false;
            });

            return map;
        }

        private static bool handleClientMessage(Dictionary<string, Func<Socket, string, HashSet<Socket>, string, bool>> commandMap, HashSet<Socket> clients, Socket client, Dictionary<Socket, string> clientMessages, string clientName)
        {
            bool keepClient = true;

            // The whole message has been received, so print it and remove the message.
            // But be careful to only pull out the data up through the end of <EOM>, because
            // there might be another message already started after that.
            var endOfMessage = clientMessages[client].IndexOf(EOM);
            var message = clientMessages[client].Substring(0, endOfMessage);
            clientMessages[client] = clientMessages[client].Substring(endOfMessage + EOM.Length);

            Console.WriteLine("{0}: {1}", clientName, message);

            // In the case of this program, the 'message' is everything, there is no other data associated with it.
            // A real program will have a message type (a key) and then data that goes along with that message (the value).
            // The key is then used as the, well, key for the hash table and then the value is what is passed into
            // the function that responds to the message.  This demo code doesn't do anything with the value ('message'), but
            // is placed here as a parameter to demonstrate where the data associated with a message type should go.
            if (commandMap.ContainsKey(message))
            {
                keepClient = commandMap[message](client, clientName, clients, message);
            }
            else
            {
                client.Send(Encoding.ASCII.GetBytes("ack"));
            }

            return keepClient;
        }


        /// <summary>
        /// Handles the response to a 'who' command from a client
        /// </summary>
        private static byte[] handleWhoRequest(HashSet<Socket> clients, Socket requester)
        {
            StringBuilder response = new StringBuilder();
            foreach (Socket connected in clients)
            {
                if (connected == requester)
                {
                    response.Append(string.Format("{0} (you)\n", connected.RemoteEndPoint));
                }
                else
                {
                    response.Append(string.Format("{0}\n", connected.RemoteEndPoint));
                }
            }
            // Remove any trailing newlines
            if (response.Length > 0)
            {
                response.Remove(response.Length - 1, 1);
            }

            return Encoding.ASCII.GetBytes(response.ToString());
        }

        /// <summary>
        /// Asynchronous task that listens for incoming client connections
        /// </summary>
        public static async void waitForClientConnection(Socket listener, HashSet<Socket> clients, Dictionary<Socket, string> clientMessages, Dictionary<Socket, string> clientNames)
        {
            await Task.Run(() =>
            {
                while (true)    // Yes, I actually coded a while true loop!
                {
                    var client = listener.Accept();

                    lock (listener)
                    {
                        clients.Add(client);
                        clientMessages.Add(client, "");
                        clientNames.Add(client, string.Format("Client {0}", clients.Count));

                        // Report the newly connected client
                        Console.WriteLine(string.Format("{0} connected from {1}", clientNames[client], client.RemoteEndPoint.ToString()));

                        // Send the welcome message back to the client
                        client.Send(Encoding.ASCII.GetBytes(string.Format("Welcome {0}", clientNames[client])));
                    }
                }
            });
        }

        private static Socket setupServerListener(ushort port)
        {
            // Get the ip address of the host (the machine running this program)
            IPHostEntry ipHost = Dns.GetHostEntry(Dns.GetHostName());
            IPAddress ipAddr = ipHost.AddressList[0];
            // Use it to make a local endpoint to open a listening socket
            IPEndPoint localEndPoint = new IPEndPoint(ipAddr, port);

            // Make a listening socket on this host and bind it to the endpoint.
            // SocketType.Stream is the type we use for TCP because it enforces packet ordering
            // and tries to be lossless.
            Socket listener = new Socket(ipAddr.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
            listener.Bind(localEndPoint);
            // Set the socket to listen, with a waiting queue of up to 10 connections.
            listener.Listen(10);

            return listener;
        }
    }
}
