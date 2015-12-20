using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication2.Models
{
    public class TestTabViewModel
    {
        [Required]
        public string Username { get; set; }

        public string LastName { get; set; }

        public bool IsEditable { get; set; }

    }
}