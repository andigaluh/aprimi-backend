module.exports = {
  host: "sumbing.maintenis.com",
  port: 465,
  user: "andi@aprimi.org",
  pass: "aprimi101!",
  bcc: "andy13galuh@gmail.com",
  userRegistrationSubject: "Welcome from aprimi.org",
  userRegistrationText: `Hi {req.body.name}, welcome to aprimi.org.\n 
    Your account is successfully submited. Please login using : \n 
    user : {req.body.email} \n 
    pass : {req.body.password} \n 
    Open this url on your browser to activate your account \n
    {urlActivation}
    `,
  userRegistrationHTML: `<h4>Hi {req.body.name}, </h4>
    <p>Welcome to aprimi.org.</p>
    <p>Your account is successfully submited. Please login using :
    <hr/>
    <ul>
      <li>User : {req.body.email}</li>
      <li>Pass : {req.body.password}</li>
    </ul>
    </p>
    <hr/>
    <p>Click this <a href="{urlActivation}">LINK</a> to activate your account<br/>
    Or open this url on your browser {urlActivationText}
    </p>
    `,
  userRegistrationSuccessText:
    "Your data is successfully submited! The activation link has been sent to your email.",
  userForgetPasswordSubject: "aprimi.org: Reset Password",
  userForgetPasswordText: `Hi {req.body.name},\n 
    To reset your password account, please click the link below : \n
    {urlActivation} \n \n \n
    Warm regards,\n
    aprimi.org
    `,
  userForgetPasswordHTML: `<h4>Hi {req.body.name}, </h4>
    <p>To reset your password account, please click the link below :
    <hr/>
    <p>Click this <a href="{urlActivation}">LINK</a> to reset your password<br/>
    Or open this url on your browser {urlActivationText}
    </p>
    `,
};