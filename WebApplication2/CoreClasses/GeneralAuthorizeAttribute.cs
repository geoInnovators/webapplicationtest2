using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace WebApplication2.CoreClasses
{
    public abstract class GeneralAuthorizeAttribute : AuthorizeAttribute
    {
        public abstract bool IsGood(IPrincipal user);

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity.IsAuthenticated && (filterContext.HttpContext.User is GeneralUser))
            {
                filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }
            else
            {
                filterContext.Result = new HttpUnauthorizedResult();
            }
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext.User.Identity.IsAuthenticated && !(httpContext.User is GeneralUser))
            {
                FormsAuthentication.SignOut();
            }
            return base.AuthorizeCore(httpContext) && IsGood(httpContext.User);

        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            try
            {
                base.OnAuthorization(filterContext);
            }
            catch (Exception ex)
            {
                throw;
                //new ExceptionLog().LogException("", ex);
            }
        }
    }
}