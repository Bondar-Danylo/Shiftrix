// Styles
import styles from "./LoginPage.module.scss";

// Icons
import emailIcon from "@/assets/icons/email_icon.svg";
import PadlockIcon from "@/assets/icons/padlock_icon.svg?react";
import eyeIcon from "@/assets/icons/eye_icon.svg";
import eyeOffIcon from "@/assets/icons/eye-off_icon.svg";

// Components
import Button from "@/components/Common/Button/Button";

// Imports
import React, { useState } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

const LoginPage = () => {
  const navigate: NavigateFunction = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter correct an email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must have at least 6 symbols";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("user_id", String(data.user.id));
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err: any) {
      setErrors({ general: err.message || "Incorrect password or email." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link to={"/login"} className={styles.logo}>
          <img src="logo_text.png" alt="Shiftrix Logo" />
        </Link>

        <form onSubmit={handleSubmit} className={styles.auth}>
          {errors.general && (
            <div className={styles.errorSummary}>{errors.general}</div>
          )}

          <div
            className={`${styles.item} ${errors.email ? styles.itemError : ""}`}
          >
            <div className={styles.item__image}>
              <img
                src={emailIcon}
                alt="Email Icon"
                className={styles.item__icon}
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.item__input}
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div
            className={`${styles.item} ${errors.password ? styles.itemError : ""}`}
          >
            <div className={styles.item__image}>
              <PadlockIcon className={styles.item__icon} />
            </div>
            <div className={styles.inputWrapper}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.item__input}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={togglePasswordVisibility}
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt="Toggle password visibility"
                />
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              size="large"
              isLink={false}
              disabled={isLoading}
              className={styles.submit__btn}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
