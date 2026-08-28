import React from "react";
const AUTH_CSS = `
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: #FAF8F4;
    color: #2B2E33;
    font-family: 'Inter', sans-serif;
  }

  .auth-card {
    width: 100%;
    max-width: 460px;
    background: #fff;
    border: 1px solid #E6E0D3;
    border-radius: 22px;
    padding: 38px;
    box-shadow: 0 15px 45px rgba(43, 46, 51, 0.08);
  }

  .auth-title {
    font-family: 'Fraunces', serif;
    font-size: 34px;
    font-weight: 600;
    margin: 0 0 10px;
    color: #2B2E33;
  }

  .auth-subtitle {
    color: #6E7278;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 28px;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 7px;
    color: #2B2E33;
  }

  .auth-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #E6E0D3;
    border-radius: 10px;
    background: #FAF8F4;
    color: #2B2E33;
    font-size: 14px;
    outline: none;
  }

  .auth-input:focus {
    border-color: #6B968C;
    box-shadow: 0 0 0 3px rgba(107, 150, 140, 0.12);
  }

  .auth-button {
    width: 100%;
    padding: 13px 18px;
    border: none;
    border-radius: 999px;
    background: #6B968C;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .auth-button:hover {
    background: #48685F;
    transform: translateY(-1px);
  }

  .auth-link {
    color: #48685F;
    text-decoration: none;
    font-weight: 600;
  }

  .auth-link:hover {
    text-decoration: underline;
  }

  .auth-error {
    padding: 10px 12px;
    border-radius: 10px;
    background: #F3E4DE;
    color: #8A4A3B;
    font-size: 13px;
  }

  .auth-success {
    padding: 10px 12px;
    border-radius: 10px;
    background: #E7F0EC;
    color: #48685F;
    font-size: 13px;
  }

  @media (max-width: 600px) {
    .auth-card {
      padding: 26px 20px;
    }

    .auth-title {
      font-size: 28px;
    }
  }
`;

export default AUTH_CSS;