import React, { useState } from 'react';
import '../assets/css/login.css';
import { setNewPassword } from '../Actions/userAction';
import { useDispatch } from 'react-redux';

function SetNewPassword(props) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const callSetPassword = async event => {
    event.preventDefault();

    if (password === confirmPassword) {
      setError('');
      const dataToPass = {
        id: props.location.search.split('=')[1],
        newPassword: password,
      };

      await dispatch(setNewPassword(dataToPass));
    } else {
      setError('password and confirm password must be same!!');
    }
  };

  return (
    <div>
      <div className="login">
        <div className="Loader" style={{ display: 'none' }}></div>
        <header className="login-header">
          <div className="logo_container-login">
            <div className="logo-login">pieramo</div>
            <div className="sub_tag_line-login">your opinion matters.</div>
          </div>
        </header>
        <div className="form-login">
          <form className="frm-login" onSubmit={e => callSetPassword(e)}>
            <div className="title-login">Create a new password</div>

            <div className="form_content-login">
              <label>Enter New Password:</label>
              <input
                type="password"
                name="newpsw"
                placeholder="Enter your new password"
                required
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="form_content-login">
              <label>Enter Confirm Password:</label>
              <input
                type="password"
                name="confirtmPsw"
                placeholder="Confirm your new password"
                required
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <small style={{ color: 'red' }}>{error}</small>
            </div>

            <button type="submit" className="confirm_ac-login">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetNewPassword;
