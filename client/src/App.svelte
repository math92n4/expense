<script>
  import { Router, Route } from 'svelte-routing';
  import Login from './routes/Login.svelte';
  import SignUp from './routes/SignUp.svelte';
  import CreateGroup from './routes/CreateGroup.svelte'
  import MyGroups from './routes/MyGroups.svelte'
  import Group from './routes/Group.svelte';
  import Nav from './components/Nav.svelte'
  import Profile from './routes/Profile.svelte';
</script>

<Nav />

<Router>
  <Route path="/" component={Login} />
  <Route path="/signup" component={SignUp} />
  <Route path="/group" component={CreateGroup} />
  <Route path="/mygroups" component={MyGroups} />
  <Route path="/group/:groupId" component={Group} />
  <Route path="/profile" component={Profile} />
</Router>