using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult ViewTest(int button)
        {
            ViewBag.button = button;
            return PartialView();
        }


        // view
        public ActionResult TestTabView(int button, bool isEditable = false)
        {
            return PartialView( new TestTabViewModel{Username = button.ToString(), IsEditable = isEditable} );
        }

        // save
        public ActionResult TestTabViewSave(TestTabViewModel model)
        {
            var i = ModelState.IsValid
            return Json("good", JsonRequestBehavior.AllowGet);
        }        

        


        public ActionResult DialogTest()
        {
            return View();
        }

    }
}