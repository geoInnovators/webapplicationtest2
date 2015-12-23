using System;

namespace WebApplication2.CoreClasses
{
    public class ControllerAuthorizeAttribute : GeneralAuthorizeAttribute
    {
        public Type UserType { get; set; }

        protected override bool IsGood(System.Security.Principal.IPrincipal user)
        {
            return (UserType == null) || (user.GetType() == UserType);
        }
    }
}