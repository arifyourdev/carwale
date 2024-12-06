// export const authUser =  (req,res,next) =>{
//   if(req.session.user){
//     next()
//   }
//   else{
//     res.redirect('/login')
//   }
// }

export const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
       req.session.redirectTo = req.originalUrl;
      return res.redirect('/login');
  }
  next();
};
