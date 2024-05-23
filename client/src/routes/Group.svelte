<script>
    import { onMount } from 'svelte';
    import { authenticated } from '../stores/auth.js';
    import { getTotalExpenses, calculateTransfers } from '../util/expenses.js';
    import { navigate } from 'svelte-routing';
    import { fetchDelete, fetchGet, fetchPost, fetchPut } from '../util/api.js';
  
    export let groupId;
    let group = null;
    let memberMessage = ""
    let expenses = [];
    let totalExpense;
    let transfers = []
  
    onMount(async () => {

        const memberCheck = await fetchGet(`/api/group/ismember/${groupId}`)

        if(memberCheck.status === 401) {
          navigate('/')
          return;
        }

        if(memberCheck.data === false) {
          navigate('/mygroups')
        } else {
          authenticated.set(true);
          const groupRes = await fetchGet(`/api/group/${groupId}`)
          group = groupRes.data;
          const expenseRes = await fetchGet(`/api/expense/${groupId}`)
          console.log(expenseRes)
          expenses = expenseRes.data

          totalExpense = getTotalExpenses(expenses)
          transfers = calculateTransfers(expenses);
        }

        const memberModal = document.getElementById('member-modal');
        const closeMemberButton = document.getElementById('close-button-member');

        closeMemberButton.addEventListener('click', () => {
          memberModal.style.display = 'none';
        });


        const postModal = document.getElementById('post-modal');
        const closePostButton = document.getElementById('close-button-post');

        closePostButton.addEventListener('click', () => {
          postModal.style.display = 'none';
        });

        const modal = document.getElementById('update-modal');
        const closeButton = document.getElementById('close-button-update');

        closeButton.addEventListener('click', () => {
          modal.style.display = 'none';
        });

      })

      

    let expense;
    let description;

    async function postExpense() {
      const postExpense = await fetchPost('/api/expense', { expense, description, groupId });
      if(postExpense.status === 401) {
        navigate('/')
      } else {
        window.location.reload();
      }
    }

    let addedEmail;


    async function addMember() {
      let addedUserId;
      const existingMember = await fetchGet(`/api/user/${addedEmail}`)
      console.log(existingMember)

      if(existingMember.status === 401) {
        navigate('/')
        return;
      }

      if(existingMember.status === 404) {
        memberMessage = existingMember.data;
        return;
        
      } else {
        addedUserId = existingMember.data.user_id;
      }

      const isMember = await fetchGet(`/api/group/ismember/${addedUserId}/${groupId}`)
      console.log(isMember)
      
      if(isMember.data === false) {
        
        const sendInvite = await fetchPost('/api/invite', { addedUserId, groupId })
        if(sendInvite.status === 401) {
          navigate('/')
          return;
        }
        memberMessage = `An invite has been sent to ${addedEmail}`
        console.log(sendInvite)
      } else {
        memberMessage = 'User is already part of the group'
      }
    }

    async function deleteExpense(expenseId) {
      console.log(expenseId)
      const deleteExpenseRes = await fetchDelete(`/api/expense/${expenseId}`)
      if(deleteExpenseRes.status === 200) {
        window.location.reload();
      }
    }

    let updatedExpense;
    let updatedDescription;
    let expenseIdToUpdate;

  function openUpdate(expenseId) {
    const expenseToUpdate = expenses.find(expense => expense.expense_id === expenseId);
    if (expenseToUpdate) {
      updatedExpense = expenseToUpdate.expense;
      updatedDescription = expenseToUpdate.description;
      expenseIdToUpdate = expenseId;
      const modal = document.getElementById('update-modal');
      modal.style.display = 'block';
    }
  }

  function openMemberModal() {
    const memberModal = document.getElementById('member-modal');
    memberModal.style.display = 'block'
  }

  function openExpenseModal() {
    const postModal = document.getElementById('post-modal');
    postModal.style.display = 'block'
  }



  async function updateExpense() {
    const updateExpense = await fetchPut('/api/expense', { updatedExpense, updatedDescription, expenseIdToUpdate })
    if(updateExpense.status === 401) {
      navigate('/');
    } else {
      window.location.reload();
    }
  }

  </script>
  
  {#if group}
    <h1 class="heading">{group.group_name}</h1>

  {:else}
    <p>Loading...</p>
  {/if}

  <div class="group-buttons">
    <button on:click={openExpenseModal}>Add expense</button>
    <button on:click={openMemberModal}>Add member</button>
  </div>
  
  <div class="modal" id="member-modal">
    <div class="modal-content">
      <span class="close-button" id="close-button-member">&times;</span>
      <form class="login" on:submit|preventDefault={addMember}>
        <label for="email">Email</label>
        <input bind:value={addedEmail} />
        <button type="submit">Add member</button>
        {#if memberMessage}
        <p class='error'>{memberMessage}</p>
        {/if}
      </form>
    </div>
  </div>
  

  <div class="table-container">
    <table class="group-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Expense</th>
          <th>Description</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#if expenses.length > 0}
        {#each expenses as { currentUser, email, expense, expense_id, description }}
          <tr>
            <td>{email}</td>
            <td>{expense}</td>
            <td>{description}</td>
            {#if currentUser}
            <td><button on:click={() => deleteExpense(expense_id)}><img class='table-svg' src="/red-cross.png" alt="x"></button></td>
            <td><button on:click={() => openUpdate(expense_id)}><img class='table-svg' src="/update.png" alt="%"></button></td>
            {/if}
          </tr>
        {/each}
        {:else}
        <tr>
          <td colspan="4">No expenses yet</td>
        </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <div class="modal" id="update-modal">
    <div class="modal-content">
      <span class="close-button" id="close-button-update">&times;</span>
      <form class="login" on:submit|preventDefault={updateExpense}>
        <label for="expense">Update expense</label>
        <input bind:value={updatedExpense} />
        <label for="description">Update description</label>
        <input bind:value={updatedDescription} />
        <button type="submit">Update expense</button>
      </form>
    </div>
  </div>

  <p class='total-expense'>Total expense: {totalExpense}</p>

  <div class="modal" id="post-modal">
    <div class="modal-content">
      <span class="close-button" id="close-button-post">&times;</span>
      <form class="login" on:submit|preventDefault={postExpense}>
        <label for="expense">Expense</label>
        <input bind:value={expense} />
        <label for="description">Description</label>
        <input bind:value={description} />
        <button type="submit">Add expense</button>
      </form>
    </div>
  </div>
  

  {#if transfers.length > 0}

  <div class='table-container' style="margin-bottom: 100px;">
  <table class="group-table" >
    <thead>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each transfers as { userFrom, userTo, amount }}
        <tr>
          <td>{userFrom}</td>
          <td>{userTo}</td>
          <td>{amount}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  </div>

  {:else}
  <p class="total-expense">No expenses to be shared!</p>
  {/if}


