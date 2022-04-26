using System;
using System.Collections.Generic;
using Random;

namespace RandomNumbers
{
    class Program
    {
        static void Main(string[] args)
        {
            //demoRandomLCG();
            //demoRandomXorShift();
            //demoRandomMT();
            //demoRandomMisc();
            //demoRandomNoReplace();
        }

        public static void demoRandomLCG()
        {
            RandomLCG lcg = new RandomLCG();
            for (int i = 0; i < 100; i++)
            {
                Console.Out.WriteLine(lcg.nextDouble());
            }
        }

        public static void demoRandomXorShift()
        {
            RandomXorShift xorShift = new RandomXorShift();
            for (int i = 0; i < 100; i++)
            {
                Console.Out.WriteLine(xorShift.nextDouble());
            }
        }

        public static void demoRandomMT()
        {
            RandomMT mt = new RandomMT();
            for (int i = 0; i < 100; i++)
            {
                Console.Out.WriteLine(mt.nextDouble());
            }
        }

        public static void demoRandomMisc()
        {
            RandomMisc misc = new RandomMisc();
            for (int i = 0; i < 100; i++)
            {
                Console.Out.WriteLine(misc.nextGaussian(83, 10));
            }
        }

        public static void demoRandomNoReplace()
        {
            RandomNoReplace rnd = new RandomNoReplace();
            List<KeyValuePair<int, int>> dist = new List<KeyValuePair<int, int>>();
            dist.Add(new KeyValuePair<int, int>(1, 2));
            dist.Add(new KeyValuePair<int, int>(2, 3));
            dist.Add(new KeyValuePair<int, int>(3, 4));
            dist.Add(new KeyValuePair<int, int>(4, 5));
            rnd.setDistribution(dist);

            for (int i = 1; i <= 14; i++)
            {
                Console.Out.WriteLine(rnd.next());
            }
        }
    }
}
