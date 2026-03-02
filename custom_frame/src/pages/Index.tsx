import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const go = (path: string) => () => navigate(path);

  return (
    <div className="page">
      <main className="card">
        <p className="tagline">언제 어디서든 같이 있는것 처럼</p>
        <h1 className="logo" aria-label="Framie">
          Framie
        </h1>

        <div className="actions" role="group" aria-label="main actions">
          <button className="btn primary" type="button" onClick={go("/frame/custom")}
            aria-label="프레임 커스텀 하기">
            프레임 커스텀 하기
          </button>
          <button className="btn outline" type="button" onClick={go("/frame/shoot")}
            aria-label="커스텀 프레임 촬영">
            커스텀 프레임 촬영
          </button>
        </div>

        <div className="auth">
          <button className="link" type="button" onClick={go("/login")}>로그인</button>
          <span className="divider" aria-hidden="true">&nbsp;&nbsp;</span>
          <button className="link" type="button" onClick={go("/join")}>회원가입</button>
        </div>
      </main>

      <style>{`
        .page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #fbf8f2;
          padding: 24px;
        }

        .card {
          width: min(980px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 56px 20px 44px;
        }

        .tagline {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: #3b56ff;
          opacity: 0.95;
        }

        .logo {
          margin: 0;
          font-size: clamp(64px, 9vw, 118px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #3b56ff;
          font-weight: 800;

          /* 귀여운 “말랑” 느낌 */
          text-shadow: 0 10px 24px rgba(59, 86, 255, 0.12);
          user-select: none;
        }

        .actions {
          margin-top: 34px;
          width: min(820px, 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 34px;
          align-items: center;
        }

        .btn {
          height: 92px;
          border-radius: 18px;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
          outline: none;
        }

        .btn:active {
          transform: translateY(1px);
        }

        .primary {
          border: 0;
          color: #ffffff;
          background: #3b56ff;
          box-shadow: 0 14px 28px rgba(59, 86, 255, 0.22);
        }

        .outline {
          background: transparent;
          color: #3b56ff;
          border: 3px solid #3b56ff;
          box-shadow: 0 14px 28px rgba(59, 86, 255, 0.08);
        }

        .btn:hover {
          opacity: 0.96;
          box-shadow: 0 16px 34px rgba(59, 86, 255, 0.18);
        }

        .auth {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #3b56ff;
          opacity: 0.9;
          font-size: 20px;
        }

        .link {
          border: 0;
          background: transparent;
          color: #3b56ff;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 10px;
          transition: background 120ms ease;
        }

        .link:hover {
          background: rgba(59, 86, 255, 0.08);
        }

        .divider {
          width: 10px;
        }

        @media (max-width: 720px) {
          .tagline {
            font-size: 18px;
          }

          .actions {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-top: 22px;
          }

          .btn {
            height: 76px;
            font-size: 22px;
            border-radius: 16px;
          }

          .auth {
            font-size: 18px;
          }

          .link {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}