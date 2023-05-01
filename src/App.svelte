<script lang="ts">
  import { isAxiosError } from "axios";
  import apiClient from "./config/axios";

  let email: string = "";
  let isVerified: boolean = false;
  let isSent: boolean = false;
  let base_url = import.meta.env.VITE_BASE_URL;

  const onSubmitVerifyEmail = async (ev: Event) => {
    ev.preventDefault();
    if (!email) {
      return;
    }
    isSent = false;
    isVerified = false;
    try {
      await apiClient.post("/verify", {
        email,
      });
    } catch (err) {
      if (!isAxiosError(err)) {
        alert("Something went wrong");
        isSent = true;
        return;
      }

      if (err.response.status === 400) {
        isVerified = true;
      }
    }
    isSent = true;
  };

  const onSubmit = async (
    ev: Event & {
      currentTarget: EventTarget & HTMLFormElement;
    }
  ) => {
    ev.preventDefault();
    let formData = new FormData(ev.currentTarget);
    formData.set("email", email);
    try {
      await apiClient.post("/upload", formData);
    } catch (err) {
      console.error(err);
    }
  };
</script>

<main>
  <div class="root">
    <h1>Jerm Resume</h1>
    <form on:submit={onSubmit}>
      <form class="form-container" on:submit={onSubmitVerifyEmail}>
        <div class="mx-auto flex full-width">
          <label for="target-email">
            <h2>Email:</h2>
          </label>
          <input
            id="target-email"
            required
            name="email"
            type="email"
            class="input-text"
            disabled={isVerified}
            bind:value={email}
          />
        </div>
        <button type="submit" disabled={isVerified}> Verify Email </button>
      </form>
      <hr />
      <div class="form-container">
        <div class="mx-auto flex full-width">
          <label for="resume-file"><h2>Uploaded File:</h2> </label>
          <input
            required
            id="resume-file"
            disabled={!isVerified}
            name="file"
            type="file"
          />
        </div>
        <button disabled={!isVerified} type="submit">Jerm</button>
      </div>
    </form>
  </div>
</main>

<style>
  .root {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  }

  .mx-auto {
    margin: 0 auto;
  }

  .flex {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .full-width {
    width: 100%;
  }

  .input-text {
    flex: 1;
    font-size: 1rem;
    padding: 8px;
  }

  .root h2 {
    margin: 0;
  }

  .root hr {
    margin: 1rem 0;
  }
</style>
