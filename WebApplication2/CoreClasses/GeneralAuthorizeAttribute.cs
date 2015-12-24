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
        private bool IsAjax(AuthorizationContext filterContext)
        {
            return filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }

        protected abstract bool IsGood(IPrincipal user);

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity.IsAuthenticated && (filterContext.HttpContext.User is GeneralUser))
            {
                if (IsAjax(filterContext))
                {
                    SetAjaxResult(filterContext, HttpStatusCode.Forbidden);
                }
                else
                    filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }
            else
            {
                if (IsAjax(filterContext))
                {
                    SetAjaxResult(filterContext, HttpStatusCode.Unauthorized);
                }
                else
                    filterContext.Result = new HttpUnauthorizedResult();
            }

        }

        private void SetAjaxResult(AuthorizationContext filterContext,  HttpStatusCode statusCode)
        {
            filterContext.Result = new JsonResult()
            {
                Data = "unauthenticated",
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
            filterContext.HttpContext.Response.Clear();
            filterContext.HttpContext.Response.StatusCode = (int)statusCode;            
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