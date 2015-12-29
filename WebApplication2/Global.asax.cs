using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebApplication2.CoreClasses;

namespace WebApplication2
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated) return;
            Guid token;
            if (!Guid.TryParse(HttpContext.Current.User.Identity.Name, out token)) return;
            var person = LoggedinPersonsCache.Current.GetPersonByToken(token);
            if (person != null)
                HttpContext.Current.User = person;
        }


    }
}
