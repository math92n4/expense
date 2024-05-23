<script>
    import { onMount } from 'svelte'
    import { authenticated } from '../stores/auth.js';
    import { fetchPost } from '../util/api.js';
    import { navigate } from 'svelte-routing';

    onMount(async () => {
        authenticated.set(true)
    })

    let groupName = '';
    let groupDesc = '';

    async function createGroup() {
        const postGroup = await fetchPost('/api/group', { groupName, groupDesc }) 
        if(postGroup.status === 401) {
            navigate('/')
            return;
        } else {
            navigate('/mygroups')
        }  
    }

</script>


<form class="login" on:submit|preventDefault={createGroup}>
    <h1>Create group</h1>
    <label for="groupName">Group Name</label>
    <input bind:value={groupName}/>
    <label for="groupDesc">Group Description</label>
    <input bind:value={groupDesc}/>
    <button type="submit">Create Group</button>
</form>