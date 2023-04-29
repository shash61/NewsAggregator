const router = require('express').Router()
const { getUserPreferences, getDefaultPreferencedNews, updateUserPreferences } = require('../../controllers/newsController/news')


router.get('/',getDefaultPreferencedNews)
router.get('/preferences',getUserPreferences)
router.put('/preferences',updateUserPreferences)


module.exports = router