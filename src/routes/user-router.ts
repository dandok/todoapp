import {Router} from  'express';
import {createUser, loginUser, homePage, registrationPage, signinPage, updateProfile, logout, deleteUser} from '../controller/user-controller'
import auth from '../middleware/auth'
/* GET home page. */

const router = Router()

router.get('/', homePage)
router.get('/registration', registrationPage)
router.get('/signin', signinPage)
router.post('/user', createUser)
router.post('/user/login', loginUser)
// router.get('/user/me', auth, viewProfile)
// router.patch('/user/me', auth, updateProfile)
router.post('/user/logout', auth, logout)
// router.post('/user/logoutall', auth, logoutAll)
// router.delete('/user/me', auth, deleteUser)


export default router;
