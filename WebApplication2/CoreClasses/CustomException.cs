using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication2.CoreClasses
{
    public class CustomException : Exception
    {
        public CustomException()
        {
        }

        public CustomException(string message)
            : base(message)
        {
        }
    }
}