import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import Header from ".";
import Navigation from "../Navigation";
import SideNavigation from "../SideNavigation";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

storiesOf("Header", module)
  .add("Basic layout", () => {
    return (
      <Router history={createBrowserHistory()}>
        <Header
          inFinnish="Suomeksi"
          inSwedish="På svenska"
          isLoggedIn={false}
          locale="fi"
          logIn="Kirjaudu sisään"
          logo={{ text: "Oiva", path: "/" }}
          authenticationLink={{
            text: ["Kirjaudu ulos", "(oiva-sanni)"],
            path: "example.path.fi"
          }}
          onLocaleChange={(...props) => {
            console.info(props);
          }}
          onLoginButtonClick={(...props) => {
            console.info(props);
          }}
          onMenuClick={(...props) => {
            console.info(props);
          }}
          organisation={{
            text: "Jyväskylän koulutuskuntayhtymä",
            path: "/"
          }}
          shortDescription={{
            text: "Opetushallinnon ohjaus- ja säätelypalvelu",
            path: "/"
          }}></Header>
      </Router>
    );
  })
  .add("Header and Navigation", () => {
    const links = [
      {
        path: "/esi-ja-perusopetus",
        text: "Esi- ja perusopetus",
        isExact: false
      },
      { path: "/lukiokoulutus", text: "Lukiokoulutus" },
      { path: "/jarjestajat", text: "Ammatillinen koulutus" },
      { path: "/vapaa-sivistystyo", text: "Vapaa sivistystyö" },
      { path: "/tilastot", text: "Tilastot" }
    ];

    return (
      <React.Fragment>
        <Router history={createBrowserHistory()}>
          <Header
            inFinnish="Suomeksi"
            inSwedish="På svenska"
            isLoggedIn={false}
            locale="fi"
            logIn="Kirjaudu sisään"
            logo={{ text: "Oiva", path: "/" }}
            authenticationLink={{
              text: ["Kirjaudu ulos", "(oiva-sanni)"],
              path: "example.path.fi"
            }}
            onLocaleChange={(...props) => {
              console.info(props);
            }}
            onLoginButtonClick={(...props) => {
              console.info(props);
            }}
            onMenuClick={(...props) => {
              console.info(props);
            }}
            organisation={{
              text: "Jyväskylän koulutuskuntayhtymä",
              path: "/"
            }}
            shortDescription={{
              text: "Opetushallinnon ohjaus- ja säätelypalvelu",
              path: "/"
            }}></Header>
          <div className="hidden md:block">
            <Navigation links={links}></Navigation>
          </div>
        </Router>
      </React.Fragment>
    );
  })
  .add("Header and Navigation and SideNavigation", () => {
    const [isSideMenuVisible, setSideMenuVisibility] = useState(false);
    const links = [
      {
        path: "/esi-ja-perusopetus",
        text: "Esi- ja perusopetus",
        isExact: false
      },
      { path: "/lukiokoulutus", text: "Lukiokoulutus" },
      { path: "/jarjestajat", text: "Ammatillinen koulutus" },
      { path: "/vapaa-sivistystyo", text: "Vapaa sivistystyö" },
      { path: "/tilastot", text: "Tilastot" }
    ];

    return (
      <React.Fragment>
        <Router history={createBrowserHistory()}>
          <Header
            inFinnish="Suomeksi"
            inSwedish="På svenska"
            isLoggedIn={false}
            locale="fi"
            logIn="Kirjaudu sisään"
            logo={{ text: "Oiva", path: "/" }}
            authenticationLink={{
              text: ["Kirjaudu ulos", "(oiva-sanni)"],
              path: "example.path.fi"
            }}
            onLocaleChange={(...props) => {
              console.info(props);
            }}
            onLoginButtonClick={(...props) => {
              console.info(props);
            }}
            onMenuClick={() => {
              return setSideMenuVisibility(isVisible => !isVisible);
            }}
            organisation={{
              text: "Jyväskylän koulutuskuntayhtymä",
              path: "/"
            }}
            shortDescription={{
              text: "Opetushallinnon ohjaus- ja säätelypalvelu",
              path: "/"
            }}></Header>
          <div className="hidden md:block">
            <Navigation links={links}></Navigation>
          </div>
          <div className="block md:hidden">
            <SideNavigation
              isVisible={isSideMenuVisible}
              handleDrawerToggle={isVisible => {
                setSideMenuVisibility(isVisible);
              }}>
              <Header
                inFinnish="Suomeksi"
                inSwedish="På svenska"
                isLoggedIn={false}
                locale="fi"
                logIn="Kirjaudu sisään"
                logo={{ text: "Oiva", path: "/" }}
                authenticationLink={{
                  text: ["Kirjaudu ulos", "(oiva-sanni)"],
                  path: "example.path.fi"
                }}
                onLocaleChange={(...props) => {
                  console.info(props);
                }}
                onLoginButtonClick={(...props) => {
                  console.info(props);
                }}
                onMenuClick={(...props) => {
                  console.info(props);
                }}
                organisation={{
                  text: "Jyväskylän koulutuskuntayhtymä",
                  path: "/"
                }}
                shortDescription={{
                  text: "Opetushallinnon ohjaus- ja säätelypalvelu",
                  path: "/"
                }}
                template={"C"}></Header>
              <div className="px-4">
                <Navigation
                  direction="vertical"
                  links={links}
                  theme={{
                    backgroundColor: "white",
                    color: "black",
                    hoverColor: "gray-100"
                  }}></Navigation>
              </div>
            </SideNavigation>
          </div>
        </Router>
      </React.Fragment>
    );
  });

//   <div >
//   {props.user && props.user.username && (
//     <Card>
//       <CardHeader
//         avatar={
//           <Avatar aria-label="Recipe" className={classes.avatar}>
//             {R.head(props.user.username)}
//           </Avatar>
//         }
//         title={props.user.username}
//         subheader={formatMessage(authMessages.loggedInInfo)}
//       />
//     </Card>
//   )}
//   {props.ytunnus && (
//     <List>
//       <ListItem button key="oma_organisaatio">
//         <ListItemIcon>
//           <Home />
//         </ListItemIcon>
//         <NavLink
//           className="no-underline"
//           ytunnus={props.ytunnus}
//           to={{
//             pathname: "/jarjestajat/" + props.ytunnus + "/omattiedot",
//             ytunnus: props.ytunnus
//           }}
//           exact>
//           Oma organisaatio
//         </NavLink>
//       </ListItem>
//     </List>
//   )}
//   <Divider />
//   <List>
//     {props.pageLinks.map(link => (
//       <ListItem button key={link.text}>
//         <NavLink to={link.path} className="no-underline">
//           {link.text}
//         </NavLink>
//       </ListItem>
//     ))}
//   </List>
//   <Divider />
//   <List>
//     {[
//       { path: "/fi", key: "inFinnish", text: "Suomeksi", value: "fi" },
//       { path: "/sv", key: "inSwedish", text: "På svenska", value: "sv" }
//     ].map(item => (
//       <ListItem button key={item.key}>
//         <ListItemIcon>
//           <Language />
//         </ListItemIcon>
//         <Button
//           onClick={() => handleLocaleChange(item.value)}
//           size="small">
//           {formatMessage(langMessages[item.key])}
//         </Button>
//       </ListItem>
//     ))}
//   </List>
//   <Divider />
//   {!sessionStorage.getItem("role") && (
//     <List>
//       <ListItem button key="login">
//         <ListItemIcon>
//           <Fingerprint />
//         </ListItemIcon>
//         <NavLink to="/cas-auth" className="no-underline">
//           {formatMessage(authMessages.logIn)}
//         </NavLink>
//       </ListItem>
//     </List>
//   )}
//   {props.user && props.user.username && (
//     <List>
//       <ListItem button key="logout">
//         <ListItemIcon>
//           <Fingerprint />
//         </ListItemIcon>
//         <NavLink to="/cas-logout" className="no-underline">
//           {formatMessage(authMessages.logOut)}
//         </NavLink>
//       </ListItem>
//     </List>
//   )}
// </div>
