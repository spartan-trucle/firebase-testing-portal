import "./App.css";
import { useState, type ButtonHTMLAttributes } from "react";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  type Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type idTokenResult,
  type IdTokenResult,
} from "firebase/auth";

function App() {
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
  });
  const [app, setApp] = useState<FirebaseApp | null>(null); // Add this state for the Firebase app instance
  const [auth, setAuth] = useState<Auth | null>(null); // Add this state for the Firebase auth instance
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult | null>(
    null
  ); // Add state for user info

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idTokenResult = await result.user.getIdTokenResult();
      console.log("ID Token Result:", idTokenResult);
      setIdTokenResult(idTokenResult);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFirebaseConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = initializeApp(firebaseConfig);
    setApp(app); // Set the Firebase app instance
    const auth = getAuth(app); // Get the Firebase auth instance
    setAuth(auth); // Set the Firebase auth instance
  };

  const handleResetFirebase = () => {
    setApp(null); // Reset the Firebase app instance
    setAuth(null); // Reset the Firebase auth instance
  };

  return (
    <main className="flex h-screen gap-4 flex-col">
      <h2 className="text-3xl font-bold text-amber-600 uppercase">
        🔑 Firebase testing portal 🔑
      </h2>
      <div className="h-full">
        {app && (
          <>
            <div className="flex flex-row gap-2 items-center">
              <p className="my-4 font-medium italic bg-green-100 w-fit py-2 px-4 rounded-md text-green-700 mx-auto">
                ✅ Firebase app instance is initialized
              </p>

              <div className="flex flex-col items-center gap-2">
                <button
                  className="!bg-transparent border-2 h-fit !border-gray-200 !hover:bg-gray-200 !text-gray-500"
                  onClick={handleResetFirebase}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 py-16">
              {idTokenResult && (
                <>
                  <p className="!text-left font-semibold">ID Token Result</p>
                  <code className="max-w-md text-left text-sm text-wrap my-4 overflow-scroll max-h-80">
                    <pre className="w-full text-wrap">
                      {JSON.stringify(idTokenResult, null, 2)}
                    </pre>
                  </code>
                </>
              )}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </button>
            </div>
          </>
        )}
        {(!auth || !app) && (
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-4 max-w-xl mx-auto"
          >
            <div>
              <label>API Key</label>
              <input
                type="text"
                name="apiKey"
                value={firebaseConfig.apiKey}
                onChange={handleInputChange}
                className="mt-1 h-12 shadow-none block w-full rounded-md border-2 !border-gray-200"
                required
              />
            </div>
            <div>
              <label>Auth Domain</label>
              <input
                type="text"
                name="authDomain"
                value={firebaseConfig.authDomain}
                onChange={handleInputChange}
                className="mt-1 h-12 shadow-none block w-full rounded-md border-2 !border-gray-200"
                required
              />
            </div>
            <div>
              <label>Project ID</label>
              <input
                type="text"
                name="projectId"
                value={firebaseConfig.projectId}
                onChange={handleInputChange}
                className="mt-1 h-12 shadow-none block w-full rounded-md border-2 !border-gray-200"
                required
              />
            </div>
            <div>
              <label>App ID</label>
              <input
                type="text"
                name="appId"
                value={firebaseConfig.appId}
                onChange={handleInputChange}
                className="mt-1 h-12 shadow-none block w-full rounded-md border-2 !border-gray-200"
                required
              />
            </div>
            <MainButton
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Initialize Firebase
            </MainButton>
          </form>
        )}
      </div>
    </main>
  );
}

export default App;

const MainButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="bg-amber-500 hover:bg-amber-400 text-white w-full"
    />
  );
};
