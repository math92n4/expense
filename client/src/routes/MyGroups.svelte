<script>
    import { onMount } from 'svelte'
    import { authenticated } from '../stores/auth.js';
    import { navigate } from 'svelte-routing';
    import { fetchDelete, fetchGet, fetchPost } from '../util/api.js'
    
    let groups = [];
    let invites = [];

    onMount(async () => {
        
        authenticated.set(true)
        const groupRes = await fetchGet(`/api/group/my`)

        if(groupRes.status === 401) {
            navigate('/')
            return;
        }

        console.log(groupRes)
        groups = groupRes.data;

        const inviteRes = await fetchGet('/api/invite')
        invites = inviteRes.data;

})

function navigateToGroup(groupId) {
    navigate(`/group/${groupId}`)
}

async function acceptInvite(inviteId) {
    const acceptRes = await fetchPost(`/api/invite/accept/${inviteId}`)
    if(acceptRes.status === 401) {
        navigate('/');
        return;
    }
    window.location.reload()
}

async function declineInvite(inviteId) {
    const declineRes = await fetchDelete(`/api/invite/decline/${inviteId}`)
    if(declineRes.status === 401) {
        navigate('/');
        return;
    }
    window.location.reload()
}

async function deleteGroup(groupId) {
    console.log(groupId)
    const deleteRes = await fetchDelete(`/api/group/${groupId}`)
    window.location.reload();
}


</script>

<h1 class="heading">My Groups</h1>

<div class='table-container'>
<table class="group-table">
    <thead>
        <tr>
            <th>Group Name</th>
            <th>Description</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each groups as group}
            <tr>
                <td>
                    <a href="#" on:click|preventDefault={() => navigateToGroup(group.group_id)}>
                      {group.group_name}
                    </a>
                  </td>

                <td>{group.description}</td>
                {#if group.owner}
                <td><button on:click={() => deleteGroup(group.group_id)}><img class='table-svg' src="/red-cross.png" alt="x"></button></td>
                {/if}
            </tr>
        {:else}
            <tr>
                <td colspan="2">No groups found. Go create one!</td>
            </tr>
        {/each}
    </tbody>
</table>
</div>

{#if invites.length > 0}
<h1 class="heading">Invites</h1>
<div class="table-container">
    <table class="group-table">
        <thead>
            <tr>
                <th></th>
                <th>Accept</th>
                <th>Decline</th>
            </tr>
        </thead>
        <tbody>
            {#each invites as invite}
            <tr>
                <td>
                    {invite.email} sent you and invite to join {invite.group_name}
                </td>
                <td>
                    <button on:click={() => acceptInvite(invite.invite_id)}><img class='table-svg' src="/tick.png" alt="x"></button>
                </td>
                <td>
                    <button on:click={() => declineInvite(invite.invite_id)}><img class='table-svg' src="/red-cross.png" alt="x"></button>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>
{/if}


