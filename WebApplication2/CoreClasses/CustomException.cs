using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication2.CoreClasses
{
    public class CustomException : Exception
    {
        public bool LogException { get; set; }

        public CustomException()
        {
        }

        public CustomException(string message)
            : base(message)
        {
        }

        public CustomException(string message, bool logException)
            : base(message)
        {
            LogException = logException;
        }
    }
}