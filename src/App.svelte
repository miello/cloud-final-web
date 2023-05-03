<script lang="ts">
  import { isAxiosError } from "axios";
  import apiClient from "./config/axios";
  import background from "./assets/background.png";

  let email: string = "";
  let error_email = "";
  let error_file = "";
  let isVerified: boolean = false;
  let isSent: boolean = false;
  let isUpload = false;
  let uploadError = "";
  let fileName = "";
  let fileId = "";

  const onSubmitVerifyEmail = async (ev: Event) => {
    ev.preventDefault();
    if (!email) {
      return;
    }
    isSent = false;
    isVerified = false;
    error_email = "";
    try {
      await apiClient.post("/verify", {
        email,
      });
      error_email =
        "Email sent. Please check your inbox for the verification and try again";
    } catch (err) {
      if (!isAxiosError(err) || !err.response) {
        error_email = "Something went wrong. Please try again later";
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
    if (!isVerified) {
      return;
    }

    let formData = new FormData(ev.currentTarget);
    uploadError = "";
    isUpload = false;

    formData.set("email", email);
    try {
      const res = await apiClient.post("/upload", formData);
      fileId = res.data.fileId;
      isUpload = true;
    } catch (err) {
      console.error(err);
      if (!isAxiosError(err) || !err.response) {
        uploadError = "Upload failed. Please try again later";
        return;
      }
    }
  };

  const onFileChange = (
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    const file = ev.currentTarget.files[0];
    if (!file) {
      return;
    }
    if (file.type !== "application/pdf") {
      error_file = "Please upload a pdf file";
      ev.currentTarget.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      error_file = "File size must be less than 8MB";
      ev.currentTarget.value = "";
      return;
    }

    error_file = "";
    fileName = file.name;
  };
</script>

<main style="position: relative">
  <img class="bg" src={background} alt="bg" />
  <div class="root">
    <div style="margin: 2rem;">
      <div
        style="background-color: #f2ee63; padding: 2rem; border-radius: 1rem"
      >
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
            {#if isSent && !isVerified}
              <h3 class="error">{error_email}</h3>
            {/if}
            {#if isSent && isVerified}
              <h3 class="success">Verify Successfully</h3>
            {/if}
          </form>
          <hr />
          <div class="form-container">
            <div class="mx-auto flex full-width flex-wrap">
              <label for="resume-file"><h2>Uploaded File:</h2> </label>
              <input
                required
                id="resume-file"
                disabled={!isVerified || isUpload}
                name="file"
                type="file"
                accept="application/pdf"
                on:change={onFileChange}
              />
            </div>
            {#if error_file}
              <h3 class="error">{error_file}</h3>
            {/if}
            {#if !error_file && fileName}
              <h3>{fileName}</h3>
            {/if}
            <button disabled={!isVerified || isUpload} type="submit"
              >Jerm ✨✨</button
            >
            {#if isUpload}
              <div>
                <h3 class="success">
                  Blessing!. Your file id is <span style="font-weight: 500">
                    {fileId}
                  </span>
                </h3>
                <h3 class="success">
                  Your jerm is in queue, Please wait and see in your inbox
                </h3>
              </div>
            {/if}
            {#if uploadError}
              <h3 class="error">{uploadError}</h3>
            {/if}
          </div>
        </form>
      </div>
    </div>
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
    box-sizing: border-box;
    padding: 2rem;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  }

  .bg {
    position: absolute;
    top: 50%;
    left: 50%;
    right: 0;
    bottom: 0;
    width: auto;
    height: min(100vh, 100vw);
    object-fit: contain;
    transform: translate(-50%, -50%);
    z-index: -1;
    opacity: 0.2;
  }
  .error {
    color: red;
  }

  .success {
    color: green;
  }

  .flex-wrap {
    flex-wrap: wrap;
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

  .root {
    color: black;
  }

  .root h1 {
    margin: 0;
    margin-bottom: 2rem;
    text-align: center;
  }

  .root h2 {
    margin: 0;
    text-align: center;
  }

  .root hr {
    margin: 1rem 0;
    background-color: black;
    text-align: center;
  }

  .root h3 {
    margin: 0;
    text-align: center;
  }
</style>
