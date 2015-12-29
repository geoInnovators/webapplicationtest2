using System;
using System.Web;
using System.Web.Caching;

namespace WebApplication2.CoreClasses
{
    public class BaseCacheHelper
    {

        public void AddSlidingKey(string key, object value, int minutes)
        {
            if (string.IsNullOrEmpty(key) || value == null) return;
            HttpRuntime.Cache.Insert(key, value, null, Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes));
        }

        private void AddNonSlidingKey(string key, object value, int minutes)
        {
            if (string.IsNullOrEmpty(key) || value == null) return;
            HttpRuntime.Cache.Insert(key, value, null, DateTime.Now.AddMinutes(minutes), Cache.NoSlidingExpiration);
        }


        public static void Remove(string key)
        {
            HttpContext.Current.Cache.Remove(key);
        }

        public static void Clear()
        {
            var enm = HttpContext.Current.Cache.GetEnumerator();
            while (enm.MoveNext())
                Remove((string)enm.Key);
        }


        public static bool Exists(string key)
        {
            return HttpContext.Current.Cache[key] != null;
        }


        public static T Get<T>(string key) where T : class
        {
            try
            {
                return (T)HttpContext.Current.Cache[key];
            }
            catch
            {
                return null;
            }
        }

        public static bool Get<T>(string key, out T value)
        {
            try
            {
                if (!Exists(key))
                {
                    value = default(T);
                    return false;
                }

                value = (T)HttpContext.Current.Cache[key];
            }
            catch
            {
                value = default(T);
                return false;
            }

            return true;
        }
    }
}