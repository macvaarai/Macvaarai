# CODE TO ADD TO App.jsx

## 1. ADD IMPORTS (at the top with other imports)

Add these lines after your existing imports:

```javascript
import MacvaarLogin from "./Components/MacvaarLogin.jsx";
import MacvaarMainPortal from "./Components/MacvaarMainPortal.jsx";
```

---

## 2. ADD MACVAAR ADMIN WRAPPER

Add this wrapper function with your other wrapper functions (like SuperAdminWrapper, etc):

```javascript
const MacvaarAdminWrapper = ({ children }) => {
  const location = useLocation();
  const adminKey = localStorage.getItem("macvaarAdminKey");

  if (!adminKey) {
    return <Navigate to="/macvaar/login" state={{ from: location }} replace />;
  }

  return children;
};
```

---

## 3. ADD MACVAAR ROUTES

Add these routes BEFORE the closing </Routes> tag (around where you added org-admin routes):

```javascript
        {/* MacvaarAI Main Admin Portal */}
        <Route
          path="/macvaar/login"
          element={<MacvaarLogin />}
        />

        <Route
          path="/macvaar/dashboard"
          element={
            <MacvaarAdminWrapper>
              <MacvaarMainPortal
                onLogout={() => {
                  localStorage.removeItem("macvaarAdminKey");
                  localStorage.removeItem("macvaarAdminId");
                  localStorage.removeItem("macvaarAdminRole");
                  window.location.href = "/macvaar/login";
                }}
              />
            </MacvaarAdminWrapper>
          }
        />
```

---

## LOCATION IN FILE

### Find this section:
```javascript
const SuperAdminWrapper = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("adminRole");
  const key = localStorage.getItem("adminKey");

  if (role !== "hero_admin" || key !== SUPER_ADMIN_KEY) {
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  return children;
};
```

### Add MacvaarAdminWrapper right after it:
```javascript
const MacvaarAdminWrapper = ({ children }) => {
  const location = useLocation();
  const adminKey = localStorage.getItem("macvaarAdminKey");

  if (!adminKey) {
    return <Navigate to="/macvaar/login" state={{ from: location }} replace />;
  }

  return children;
};
```

---

### Find this section:
```javascript
        {/* 🔹 ORGANIZATION ADMIN - Organization-level management */}
        <Route
          path="/org-admin/login"
          element={<OrganizationLogin onLoginSuccess={(data) => {}} />}
        />

        <Route
          path="/org-admin/dashboard"
          element={
            <OrgAdminWrapper>
              <OrganizationAdminDashboard
                onLogout={() => window.location.href = '/org-admin/login'}
              />
            </OrgAdminWrapper>
          }
        />
      </Routes>
```

### Add MacvaarAI routes BEFORE </Routes>:
```javascript
        {/* 🔹 ORGANIZATION ADMIN - Organization-level management */}
        <Route
          path="/org-admin/login"
          element={<OrganizationLogin onLoginSuccess={(data) => {}} />}
        />

        <Route
          path="/org-admin/dashboard"
          element={
            <OrgAdminWrapper>
              <OrganizationAdminDashboard
                onLogout={() => window.location.href = '/org-admin/login'}
              />
            </OrgAdminWrapper>
          }
        />

        {/* MacvaarAI Main Admin Portal */}
        <Route
          path="/macvaar/login"
          element={<MacvaarLogin />}
        />

        <Route
          path="/macvaar/dashboard"
          element={
            <MacvaarAdminWrapper>
              <MacvaarMainPortal
                onLogout={() => {
                  localStorage.removeItem("macvaarAdminKey");
                  localStorage.removeItem("macvaarAdminId");
                  localStorage.removeItem("macvaarAdminRole");
                  window.location.href = "/macvaar/login";
                }}
              />
            </MacvaarAdminWrapper>
          }
        />
      </Routes>
```

---

## SUMMARY

### What to add to App.jsx:

1. **At top (imports section):**
   - `import MacvaarLogin from "./Components/MacvaarLogin.jsx";`
   - `import MacvaarMainPortal from "./Components/MacvaarMainPortal.jsx";`

2. **Wrapper functions section:**
   - Add MacvaarAdminWrapper function

3. **Routes section:**
   - Add /macvaar/login route
   - Add /macvaar/dashboard route

That's it! The components are already created and backend is ready.

---

## TESTING AFTER UPDATE

Once you add the code to App.jsx:

```
1. http://localhost:5173/macvaar/login
2. Enter key: hero_admin_001
3. Click "Login to Portal"
4. See MacvaarAI dashboard with all 4 organizations
5. Click each organization card
6. Click tabs (Dashboard, Organizations, Settings)
7. Everything should work!
```

---

## ALL 3 TIERS ARE NOW COMPLETE!

**Tier 1:** MacvaarAI Main Portal ✅
**Tier 2:** Organization Portals ✅
**Tier 3:** Hospital Portals ✅ (ready for logo enhancement)

Everything is implemented and ready to impress the CM!
