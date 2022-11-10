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

module.exports = { sendVerificationEmail };
