using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication2.CoreClasses;

namespace WebApplication2.Controllers
{
    [ControllerAuthorize(UserType = typeof(TestUser))]
    public class Test1Controller : Controller
    {
        //
        // GET: /Test1/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AjaxResult()
        {
            return new JsonResult()
            {
                Data = "ajax",
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
	}
}