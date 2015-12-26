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
            // unauthorized
            if (filterContext.HttpContext.User.Identity.IsAuthenticated && (filterContext.HttpContext.User is GeneralUser))
            {
                if (IsAjax(filterContext))
                {
                    SetAjaxResult(filterContext, HttpStatusCode.Forbidden, "unauthorized");
                }
                else
                    filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden);
            }
            // unauthenticated
            else
            {
                if (IsAjax(filterContext))
                {
                    SetAjaxResult(filterContext, HttpStatusCode.Forbidden, "unauthenticated");
                }
                else
                    filterContext.Result = new HttpUnauthorizedResult();
            }

        }

        private void SetAjaxResult(AuthorizationContext filterContext,  HttpStatusCode statusCode, string text)
        {
            filterContext.Result = 
            new JsonResult()
            {
                Data = new { text  = text},
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
    }
}