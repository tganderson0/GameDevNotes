using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Client
{
    class Program
    {
        private static Predicate<string> ParamPort = arg => arg == "-p" || arg == "--port" || arg == "-port";
        private static Predicate<string> ParamIPAddress = arg => arg == "-i" || arg == "--ip" || arg == "-ip";
        private const string EOM = "<EOM>";

        public static int Main(string[] args)
        {
            if (!readArgs(args, out Dictionary<Predicate<string>, string> argsAndValues))
            {
                return 1;
            }

            if (!validateArgs(argsAndValues))
            {
                return 1;
            }

            //
            // Everything should be good at this point, let's get started...
            var port = ushort.Parse(argsAndValues[ParamPort]);
            IPAddress address = parseIPAddress(argsAndValues[ParamIPAddress]);
            IPEndPoint endpoint = new IPEndPoint(address, port);

            connectToServer(endpoint);

            return 0;
        }

        /// <summary>
        /// Organize value pairs into a dictionary.
        /// </summary>
        static bool readArgs(string[] args, out Dictionary<Predicate<string>, string> argsAndValues)
        {
            argsAndValues = new Dictionary<Predicate<string>, string>();
            // Each predicate returns true if a string matches what it's looking for
            List<Predicate<string>> parameters = new List<Predicate<string>>() {
                ParamPort,
                ParamIPAddress
            };

            //
            // Validate there are an even number of arguments
            if (args.Length % 2 != 0)
            {
                Console.WriteLine("Error: Incorrect number of command line arguments");
                return false;
            }

            for (int i = 0; i < args.Length; i += 2)
            {
                var arg = args[i].Trim();
                foreach (var param in parameters)
                {
                    if (param(arg))
                    {
                        if (argsAndValues.ContainsKey(param))
                        {
                            Console.Write("Error: Duplicate parameter {0}\n", arg);
                        }
                        else
                        {
                            argsAndValues.Add(param, args[i + 1]);
                        }
                    }
                }

            }

            return true;
        }

        static bool validateArgs(Dictionary<Predicate<string>, string> argsAndValues)
        {
            bool allValid = true;
            // Make sure all the required parameters have been provided and their values are okay
            if (!argsAndValues.ContainsKey(ParamPort))
            {
                Console.WriteLine("Error: Expected port parameter (-p / --port / -port)");
                allValid = false;
            }
            if (argsAndValues.ContainsKey(ParamPort) && !ushort.TryParse(argsAndValues[ParamPort], out ushort port))
            {
                Console.WriteLine("Error: Invalid port number \"{0}\"", argsAndValues[ParamPort]);
                allValid = false;
            }

            if (!argsAndValues.ContainsKey(ParamIPAddress))
            {
                Console.WriteLine("Error: Expected IP address parameter (-i / --ip / -ip)");
                allValid = false;
            }
            else
            {
                //
                // change our mind if we find out it is an invalid address
                bool validIPAddress = true;
                if (argsAndValues[ParamIPAddress] == "localhost")
                {
                    // Yep, still valid
                }
                else
                {
                    // Break the string into its 4 parts
                    string[] parts = argsAndValues[ParamIPAddress].Split('.');
                    if (parts.Length != 4)
                    {
                        Console.WriteLine("Error: Invalid IP address string \"{0}\"", argsAndValues[ParamIPAddress]);
                        validIPAddress = false;
                    }

                    // parse the parts as bytes
                    byte[] bytes = new byte[4];
                    for (int i = 0; i < 4; i++)
                    {
                        if (!byte.TryParse(parts[i], out bytes[i]))
                        {
                            Console.WriteLine("Error: Invalid IP address \"{0}\"", argsAndValues[ParamIPAddress]);
                            validIPAddress = false;
                        }
                    }
                }
                allValid = allValid && validIPAddress;
            }

            return allValid;
        }

        static IPAddress parseIPAddress(string argument)
        {
            IPAddress ipAddress;
            if (argument == "localhost")
            {
                // Use the local host's ip address by
                IPHostEntry ipHost = Dns.GetHostEntry(Dns.GetHostName());
                ipAddress = ipHost.AddressList[0];
            }
            else
            {
                // Break the string into its 4 parts
                string[] parts = argument.Split('.');
                // parse the parts as bytes
                byte[] bytes = new byte[4];
                for (int i = 0; i < 4; i++)
                {
                    bytes[i] = byte.Parse(parts[i]);
                }

                // Construct an address from the 4 bytes
                ipAddress = new IPAddress(bytes);
            }

            return ipAddress;
        }

        static void reportMessage(string message)
        {
            Console.WriteLine(">> {0}", message.Replace("\n", "\n>> "));
        }

        static void reportMessage(byte[] response)
        {
            reportMessage(Encoding.ASCII.GetString(response));
        }

        static void connectToServer(IPEndPoint remoteEndPoint)
        {
            const int SERVER_TIMEOUT_SECONDS = 20;

            try
            {
                // Make a Socket interface for this host
                Socket server = new Socket(remoteEndPoint.AddressFamily, SocketType.Stream, ProtocolType.Tcp);

                try
                {
                    // Connect the socket to the remote endpoint
                    server.Connect(remoteEndPoint);

                    // Wait for the server to respond.
                    DateTime waitStart = DateTime.Now;
                    while (server.Available == 0)
                    {
                        if ((DateTime.Now - waitStart).TotalSeconds >= SERVER_TIMEOUT_SECONDS)
                        {
                            // Print a message and return if the server took too long.
                            Console.WriteLine("Connection to server timed out!");
                            return;
                        }
                    }

                    // The server's first message is a MOTD, which should be printed in full.
                    byte[] initialMessage = new byte[server.Available];
                    server.Receive(initialMessage);

                    Console.WriteLine("Connected to server at {0} ", server.RemoteEndPoint.ToString());
                    reportMessage(initialMessage);

                    bool stayConnected = true;

                    Console.WriteLine("Enter messages for the server, or use 'who' or 'quit'.");

                    while (stayConnected)
                    {
                        string input = string.Empty;
                        while (input == string.Empty)
                        {
                            Console.Write("> ");
                            input = Console.ReadLine();
                        }


                        // Convert the read input into an array of bytes for the server.
                        // The special string "<EOM>" signifies to the server that the message is ended.
                        byte[] message = Encoding.ASCII.GetBytes(input + EOM);
                        server.Send(message);

                        // Make a buffer for receiving a response from the server.
                        // We assume the server won't respond with more than 1024 bytes.
                        byte[] messageReceived = new byte[1024];
                        // Receive the response from the server.
                        // This method returns a number of bytes received,
                        // which is used to convert the response to a string.
                        int bytesReceived = server.Receive(messageReceived);
                        string response = Encoding.ASCII.GetString(messageReceived, 0, bytesReceived);

                        if (response == "bye")
                        {
                            stayConnected = false;
                        }
                        else
                        {
                            reportMessage(response);
                        }
                    }

                    // Close the socket.
                    server.Shutdown(SocketShutdown.Both);
                    server.Close();
                }
                // Socket.Connect can throw some exceptions. Handle them here.
                catch (ArgumentNullException ane)
                {
                    Console.WriteLine("ArgumentNullException : {0}", ane.ToString());
                }
                catch (SocketException se)
                {
                    Console.WriteLine("SocketException : {0}", se.ToString());
                }
                catch (Exception e)
                {
                    Console.WriteLine("Unexpected exception : {0}", e.ToString());
                }
            }
            catch (Exception e)
            {

                Console.WriteLine(e.ToString());
            }
        }
    }
}
