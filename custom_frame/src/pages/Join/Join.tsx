import "./Join.css";

import { useNavigate } from "react-router-dom";

import JoinLogo from "../../assets/Join_Logo.svg";
import Logo from "../../assets/Framie_blue.svg";

export default function Join() {
  const navigate = useNavigate();

  return (
    <div className="join-page">
      {/* Left */}
      <section className="join-left" aria-label="Framie branding">
        <div className="join-left-inner">
          <p className="join-left-subtitle">언제 어디서든 같이 있는것 처럼</p>
          <img src={Logo} alt="Framie" className="join-left-logo" />
        </div>
      </section>

      {/* Right */}
      <section className="join-right" aria-label="join form">
        <div className="join-right-inner">
          <img src={JoinLogo} alt="join" className="join-title" />

          <form className="join-form" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="join-id">
              아이디
            </label>
            <input
              id="join-id"
              className="join-input"
              type="text"
              placeholder="아이디 입력"
              autoComplete="username"
            />

            <label className="sr-only" htmlFor="join-password">
              비밀번호
            </label>
            <input
              id="join-password"
              className="join-input"
              type="password"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
            />

            <div className="join-links">
              <button
                type="button"
                className="join-link"
                onClick={() => navigate("/login")}
              >
                아이디가 이미 있다면 !
              </button>
              <button
                type="button"
                className="join-link"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
            </div>

            <button type="submit" className="join-submit">
                회원가입
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
