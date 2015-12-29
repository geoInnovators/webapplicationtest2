using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication2.CoreClasses
{
    public class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        private bool IsAjax(ExceptionContext filterContext)
        {
            return filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
        public override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled || !filterContext.HttpContext.IsCustomErrorEnabled)
            {
                return;
            }

            LogException(filterContext.Exception);

            if (IsAjax(filterContext))
            {
                var text = (filterContext.Exception is CustomException)
                    ? filterContext.Exception.Message
                    : "სისტემური შეცდომა";
                filterContext.Result = new JsonResult()
                {
                    Data = new {text} ,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };

                filterContext.ExceptionHandled = true;
                filterContext.HttpContext.Response.Clear();
                filterContext.HttpContext.Response.StatusCode = 500;
            }
            else
            {
                base.OnException(filterContext);
            }

        }

        private void LogException(Exception ex)
        {
            var ex1 = ex as CustomException;
            if (ex1 != null && !ex1.LogException)
                return;

            // logging 

        }

    }
}