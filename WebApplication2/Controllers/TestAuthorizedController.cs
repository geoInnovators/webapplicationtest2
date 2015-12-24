using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
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

        public ActionResult ClearCache()
        {
            LoggedinPersonsCache.Current.RemovePerson(User as GeneralUser);
            return View("Index");
        }
        public ActionResult SignOut()
        {
            FormsAuthentication.SignOut();
            return View("Index");
        }

        public ActionResult SetTestUser()
        {
            TestUser user = new TestUser
            {
                Identity = (User as GeneralUser).Identity,
                Token = (User as GeneralUser).Token
            };
            LoggedinPersonsCache.Current.UpdatePerson(user);
            return RedirectToAction("Index");
        }

        public ActionResult SetGeneralUser()
        {
            GeneralUser user = new GeneralUser
            {
                Identity = (User as GeneralUser).Identity,
                Token = (User as GeneralUser).Token
            };
            LoggedinPersonsCache.Current.UpdatePerson(user);
            return RedirectToAction("Index");
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