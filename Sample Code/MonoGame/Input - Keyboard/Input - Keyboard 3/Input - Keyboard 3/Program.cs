﻿using System;

namespace CS5410
{
    public static class Program
    {
        [STAThread]
        static void Main()
        {
            using (var game = new Keyboard3())
                game.Run();
        }
    }
}
