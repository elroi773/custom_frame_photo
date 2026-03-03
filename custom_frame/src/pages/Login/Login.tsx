import "./Login.css";

import { useNavigate } from "react-router-dom";

import LoginLogo from "../../assets/Login_Logo.svg";
import Logo from "../../assets/Framie_white.svg";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      {/* Left */}
      <section className="login-left" aria-label="Framie branding">
        <div className="login-left-inner">
          <p className="login-left-subtitle">언제 어디서든 같이 있는것 처럼</p>
          <img src={Logo} alt="Framie" className="login-left-logo" />
        </div>
      </section>

      {/* Right */}
      <section className="login-right" aria-label="Login form">
        <div className="login-right-inner">
          <img src={LoginLogo} alt="Login" className="login-title" />

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="login-id">
              아이디
            </label>
            <input
              id="login-id"
              className="login-input"
              type="text"
              placeholder="아이디 입력"
              autoComplete="username"
            />

            <label className="sr-only" htmlFor="login-password">
              비밀번호
            </label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />

            <div className="logi">
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/join")}
              >
                아이디가 없다면 ?
              </button>
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/join")}
              >
                회원가입
              </button>
            </div>

            <button type="submit" className="login-submit">
              로그인
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}