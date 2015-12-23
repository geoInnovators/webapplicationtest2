using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication2.CoreClasses;

namespace WebApplication2.Controllers
{

    [ControllerAuthorize(UserType = typeof(GeneralUser))]
    public class TestAuthorizedController : Controller
    {
        //
        // GET: /TestAuthorized/
        public ActionResult Index()
        {
            return View();
        }
	}
}