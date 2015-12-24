using System;

namespace WebApplication2.CoreClasses
{
    public class LoggedinPersonsCache : BaseCacheHelper
    {
        private static LoggedinPersonsCache _current;

        public static LoggedinPersonsCache Current
        {
            get { return _current ?? (_current = new LoggedinPersonsCache()); }
        }

        public GeneralUser GetPersonByToken(Guid token)
        {
            GeneralUser result = null;
            Get<GeneralUser>(token.ToString(), out result);
            return result;
        }

        public bool AddNewPerson(GeneralUser user)
        {
            AddSlidingKey(user.Token.ToString(), user, 2);
            return true;
        }


        public bool UpdatePerson(GeneralUser user)
        {
            Remove(user.Token.ToString());
            AddSlidingKey(user.Token.ToString(), user, 2);
            return true;
        }


        public bool RemovePerson(GeneralUser user)
        {
            if (user == null || user.Token == null || !Exists(user.Token.ToString())) return false;
            Remove(user.Token.ToString());
            return true;
        }

    }
}