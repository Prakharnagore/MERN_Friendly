const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/authplayground";
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH, MAILING_ACCESS } =
  process.env;

const auth = new OAuth2(MAILING_ID, MAILING_SECRET, MAILING_REFRESH);

const sendVerificationEmail = (email, name, url) => {
  auth.setCredentials({
    refresh_token: MAILING_REFRESH,
  });
  const accessToken = auth.getAccessToken();
  const smtp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Friends email verification",
    html: `<body style="box-sizing:border-box;padding:0;margin:0;font-family:Roboto"><div style="max-width:700px;display:flex;align-items:center;gap:10px;color:#4267b2;padding:10px"><img src="https://www.svgrepo.com/show/82670/foursquare.svg" alt="hello" style="width:40px;filter:invert(8%) sepia(100%) saturate(7425%) hue-rotate(247deg) brightness(94%) contrast(139%);border-radius:2px"><span style="color:#000"><b>Action required :</b>Activate your friends account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5"><span>Hello ${name}</span><div style="padding:10px 0;margin-bottom:5px"><span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum nemo reprehenderit perspiciatis consequatu</span></div><a style="width:200px;padding:10px 15px;background:#0000fa;color:#fff;text-decoration:none;font-weight:600" href=${url}>Confirm your account</a><br><div style="padding-top:20px"><span>Friends allows you to say in touch with all your friends. Once registered on friends, you can share photos, organize events and much more.</span></div></div></body>`,
  };

  smtp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};

const sendResetCode = (email, name, code) => {
  auth.setCredentials({
    refresh_token: MAILING_REFRESH,
  });
  const accessToken = auth.getAccessToken();
  const stmp = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      clientId: MAILING_ID,
      clientSecret: MAILING_SECRET,
      refreshToken: MAILING_REFRESH,
      accessToken,
    },
  });
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Reset Friends password",
    html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://www.svgrepo.com/show/82670/foursquare.svg" alt="" style="width:30px"><span>Action requise : Activate your Friends account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Friends. To complete your registration, please confirm your account.</span></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Friends allows you to stay in touch with all your friends, once refistered on friends,you can share photos,organize events and much more.</span></div></div>`,
  };
  stmp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};

module.exports = { sendVerificationEmail, sendResetCode };
