using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace WebApplication2.CoreClasses
{
    public class GeneralUser : IPrincipal
    {
        public void Authenticate()
        {
            Token = Guid.NewGuid();
            Identity = new GenericIdentity(Token.ToString());
        }

        public bool IsInRole(string role)
        {
            return true;
        }

        public IIdentity Identity { get;  set; }
        public Guid? Token { get; set; }


    }
}