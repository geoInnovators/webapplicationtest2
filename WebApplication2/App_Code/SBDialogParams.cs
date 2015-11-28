using System.Web.Mvc;
using System.Web.UI.HtmlControls;
using System.Web.WebPages;
using HtmlHelper = System.Web.WebPages.Html.HtmlHelper;

namespace WebApplication2
{
    public class SBDialogParams
    {
        public WebViewPage Page { get; set; }

        public SBDialogParams()
        {
            Content = "";
        }
        public string Id { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public string Title { get; set; }
        public bool? Expanded { get; set; }
        public bool? Visibility { get; set; }
        public string Content { get; set; }
        public string AjaxUrl { get; set; }
        public string EventOpened { get; set; }
        public string EventClosing { get; set; }
        public string EventClosed { get; set; }

    }
}