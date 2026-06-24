import { Store } from '../../store.js';
import { navigateTo } from '../../router.js';
import { isAdmin, isContentManager, isSuperAdmin } from '../../auth.js';
import { Navbar, initNavbar } from '../../components/navbar.js';
import { Sidebar, initSidebar } from '../../components/sidebar.js';
import { showToast } from '../../components/toast.js';
import { supabase } from '../../supabase.js';
import { openModal, closeModal, confirmModal } from '../../components/modal.js';

export async function render() {
  if (!isAdmin()) {
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  window.navigateTo = navigateTo;

  let currentClassId = 'pu1'; // default selected class filter

  await renderPage();

  async function renderPage() {
    const syllabus = await Store.getSyllabus();
    const canCRUD = isContentManager(); // Content Managers and Super Admins get full CRUD

    // Filter units based on active class
    const units = syllabus.filter(u => u.classId === currentClassId);

    app.innerHTML = `
      ${await Navbar()}
      <div class="app-layout">
        ${Sidebar()}
        <main class="main-content">
          <div class="admin-header animate-fade-in">
            <div>
              <h1>📁 Manage Content</h1>
              <p class="text-muted">Structure the Biology syllabus: Units, Chapters, and Concepts</p>
            </div>
            <div class="admin-header-actions">
              ${canCRUD ? `
                <button class="btn btn-primary" id="addUnitBtn"><i data-lucide="plus"></i> Add Unit</button>
              ` : '<span class="badge badge-warning">View & Edit Mode Only</span>'}
            </div>
          </div>

          <!-- Class Selection Tabs -->
          <div class="chapter-tabs animate-fade-in" style="margin-bottom: 2rem;">
            <button class="tab-item ${currentClassId === 'pu1' ? 'active' : ''}" id="tabPU1">
              1st PU Biology
            </button>
            <button class="tab-item ${currentClassId === 'pu2' ? 'active' : ''}" id="tabPU2">
              2nd PU Biology
            </button>
          </div>

          <!-- Syllabus Tree structure -->
          <div class="syllabus-tree-container animate-fade-in">
            ${units.length === 0 ? `
              <div class="card p-4 text-center">
                <p class="text-muted">No units found for this class. Add one to get started.</p>
              </div>
            ` : units.map((unit, uIdx) => `
              <!-- Unit Card -->
              <div class="card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--primary);">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: var(--bg-light);">
                  <div>
                    <span style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">Unit ${unit.number}:</span>
                    <strong style="font-size: 1.1rem; margin-left: 0.25rem;">${unit.icon || '📁'} ${unit.title}</strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <!-- Unit Order Shifting -->
                    <button class="btn btn-sm btn-ghost shift-unit-up" data-uid="${unit.id}" title="Shift Up" ${uIdx === 0 ? 'disabled' : ''}>
                      ⬆️
                    </button>
                    <button class="btn btn-sm btn-ghost shift-unit-down" data-uid="${unit.id}" title="Shift Down" ${uIdx === units.length - 1 ? 'disabled' : ''}>
                      ⬇️
                    </button>
                    
                    <button class="btn btn-sm btn-outline edit-unit" data-uid="${unit.id}">Edit</button>
                    ${canCRUD ? `
                      <button class="btn btn-sm btn-danger delete-unit" data-uid="${unit.id}">Delete</button>
                    ` : ''}
                  </div>
                </div>
                
                <div class="card-body" style="padding: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="margin: 0; color: var(--text-color);">Chapters in this Unit</h4>
                    ${canCRUD ? `
                      <button class="btn btn-sm btn-secondary add-chapter" data-uid="${unit.id}"><i data-lucide="plus"></i> Add Chapter</button>
                    ` : ''}
                  </div>

                  <!-- Chapters List -->
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${(unit.chapters || []).length === 0 ? `
                      <p class="text-muted" style="font-size: 0.9rem; margin: 0; padding: 0.5rem;">No chapters added yet.</p>
                    ` : unit.chapters.map((ch, cIdx) => `
                      <!-- Chapter Row -->
                      <div class="chapter-node" style="background: var(--bg-hover); border-radius: 0.5rem; padding: 1rem; border: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                          <div>
                            <strong>${ch.icon || '📖'} ${ch.title}</strong>
                            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">${ch.description || ''}</p>
                          </div>
                          <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <!-- Chapter Shift -->
                            <button class="btn btn-sm btn-ghost shift-ch-up" data-uid="${unit.id}" data-chid="${ch.id}" title="Shift Up" ${cIdx === 0 ? 'disabled' : ''}>
                              ⬆️
                            </button>
                            <button class="btn btn-sm btn-ghost shift-ch-down" data-uid="${unit.id}" data-chid="${ch.id}" title="Shift Down" ${cIdx === unit.chapters.length - 1 ? 'disabled' : ''}>
                              ⬇️
                            </button>
                            <button class="btn btn-sm btn-outline btn-sm-edit edit-chapter" data-uid="${unit.id}" data-chid="${ch.id}">Edit</button>
                            ${canCRUD ? `
                              <button class="btn btn-sm btn-danger delete-chapter" data-chid="${ch.id}">Delete</button>
                            ` : ''}
                          </div>
                        </div>

                        <!-- Concepts Section -->
                        <div style="margin-left: 1.5rem; padding-left: 1rem; border-left: 2px dashed var(--border-color);">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Concepts</span>
                            ${canCRUD ? `
                              <button class="btn btn-sm btn-ghost add-concept" data-chid="${ch.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">+ Add Concept</button>
                            ` : ''}
                          </div>

                          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${(ch.concepts || []).length === 0 ? `
                              <span class="text-muted" style="font-size: 0.8rem;">No concepts added.</span>
                            ` : ch.concepts.map((con, conIdx) => `
                              <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 0.5rem 0.75rem; border-radius: 0.25rem; border: 1px solid var(--border-color);">
                                <div>
                                  <span style="font-size: 0.9rem; font-weight: 600;">${con.title}</span>
                                  ${con.description ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${con.description}</div>` : ''}
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.2rem;">
                                  <!-- Concept Shift -->
                                  <button class="btn btn-sm btn-ghost shift-con-up" data-chid="${ch.id}" data-conid="${con.id}" title="Shift Up" ${conIdx === 0 ? 'disabled' : ''} style="padding: 0.1rem 0.25rem; font-size: 0.75rem;">
                                    ⬆️
                                  </button>
                                  <button class="btn btn-sm btn-ghost shift-con-down" data-chid="${ch.id}" data-conid="${con.id}" title="Shift Down" ${conIdx === ch.concepts.length - 1 ? 'disabled' : ''} style="padding: 0.1rem 0.25rem; font-size: 0.75rem;">
                                    ⬇️
                                  </button>
                                  <button class="btn btn-sm btn-outline edit-concept" data-chid="${ch.id}" data-conid="${con.id}" style="padding: 0.1rem 0.4rem; font-size: 0.75rem;">Edit</button>
                                  ${canCRUD ? `
                                    <button class="btn btn-sm btn-danger delete-concept" data-conid="${con.id}" style="padding: 0.1rem 0.4rem; font-size: 0.75rem;">Delete</button>
                                  ` : ''}
                                </div>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </main>
      </div>
    `;

    initNavbar();
    initSidebar();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Bind Class switching
    document.getElementById('tabPU1')?.addEventListener('click', () => {
      currentClassId = 'pu1';
      renderPage();
    });
    document.getElementById('tabPU2')?.addEventListener('click', () => {
      currentClassId = 'pu2';
      renderPage();
    });

    // Add Unit Action
    document.getElementById('addUnitBtn')?.addEventListener('click', () => {
      openModal({
        title: 'Add New Unit',
        content: `
          <div class="form-group">
            <label class="form-label">Unit Number (Roman numerals: e.g. I, II, III)</label>
            <input class="form-input" id="uNumber" placeholder="e.g. XI">
          </div>
          <div class="form-group">
            <label class="form-label">Unit Title</label>
            <input class="form-input" id="uTitle" placeholder="e.g. Plant Physiology">
          </div>
          <div class="form-group">
            <label class="form-label">Unit Icon</label>
            <input class="form-input" id="uIcon" placeholder="e.g. 🌿">
          </div>
          <div class="form-group">
            <label class="form-label">Class</label>
            <select class="form-select" id="uClass">
              <option value="pu1" ${currentClassId === 'pu1' ? 'selected' : ''}>1st PU</option>
              <option value="pu2" ${currentClassId === 'pu2' ? 'selected' : ''}>2nd PU</option>
            </select>
          </div>
        `,
        actions: [
          { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
          { label: 'Create Unit', class: 'btn btn-primary', onClick: async () => {
            const number = document.getElementById('uNumber').value.trim();
            const title = document.getElementById('uTitle').value.trim();
            const icon = document.getElementById('uIcon').value.trim();
            const classId = document.getElementById('uClass').value;
            if (!number || !title) {
              showToast('Number and Title are required', 'error');
              return;
            }
            const newId = 'u_' + Date.now();
            await supabase.from('units').insert({ id: newId, name: title, description: number, icon: icon, class_id: classId });
            Store.logActivity('Create Unit', `Created Unit ${number}: ${title}`);
            closeModal();
            showToast('Unit created successfully', 'success');
            renderPage();
          }}
        ]
      });
    });

    // Edit Unit Action
    document.querySelectorAll('.edit-unit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const unitId = btn.dataset.uid;
        const unit = Store.getSyllabus().find(u => u.id === unitId);
        if (!unit) return;

        openModal({
          title: 'Edit Unit',
          content: `
            <div class="form-group">
              <label class="form-label">Unit Number</label>
              <input class="form-input" id="uNumber" value="${unit.number}">
            </div>
            <div class="form-group">
              <label class="form-label">Unit Title</label>
              <input class="form-input" id="uTitle" value="${unit.title}">
            </div>
            <div class="form-group">
              <label class="form-label">Unit Icon</label>
              <input class="form-input" id="uIcon" value="${unit.icon || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Class</label>
              <select class="form-select" id="uClass">
                <option value="pu1" ${unit.classId === 'pu1' ? 'selected' : ''}>1st PU</option>
                <option value="pu2" ${unit.classId === 'pu2' ? 'selected' : ''}>2nd PU</option>
              </select>
            </div>
          `,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
            { label: 'Save Changes', class: 'btn btn-primary', onClick: async () => {
              const number = document.getElementById('uNumber').value.trim();
              const title = document.getElementById('uTitle').value.trim();
              const icon = document.getElementById('uIcon').value.trim();
              const classId = document.getElementById('uClass').value;
              if (!number || !title) {
                showToast('Number and Title are required', 'error');
                return;
              }
              await supabase.from('units').update({ name: title, description: number, icon: icon, class_id: classId }).eq('id', unitId);
              Store.logActivity('Edit Unit', `Updated Unit ${number}: ${title}`);
              closeModal();
              showToast('Unit updated successfully', 'success');
              renderPage();
            }}
          ]
        });
      });
    });

    // Delete Unit Action
    document.querySelectorAll('.delete-unit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const unitId = btn.dataset.uid;
        if (await confirmModal('Delete Unit', 'Are you sure you want to delete this Unit? All chapters inside will be lost!')) {
          const syllabus = Store.getSyllabus();
          const unit = syllabus.find(u => u.id === unitId);
          await supabase.from('units').delete().eq('id', unitId);
          Store.logActivity('Delete Unit', `Deleted Unit: ${unit?.title}`);
          showToast('Unit deleted successfully', 'success');
          renderPage();
        }
      });
    });

    // Add Chapter Action
    document.querySelectorAll('.add-chapter').forEach(btn => {
      btn.addEventListener('click', async () => {
        const unitId = btn.dataset.uid;
        openModal({
          title: 'Add Chapter',
          content: `
            <div class="form-group">
              <label class="form-label">Chapter Title</label>
              <input class="form-input" id="chTitle" placeholder="e.g. Photosynthesis">
            </div>
            <div class="form-group">
              <label class="form-label">Chapter Description</label>
              <textarea class="form-textarea" id="chDesc" rows="3" placeholder="Brief details about the chapter..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Chapter Icon</label>
              <input class="form-input" id="chIcon" placeholder="e.g. ☀️">
            </div>
          `,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
            { label: 'Add Chapter', class: 'btn btn-primary', onClick: async () => {
              const title = document.getElementById('chTitle').value.trim();
              const description = document.getElementById('chDesc').value.trim();
              const icon = document.getElementById('chIcon').value.trim();
              if (!title) {
                showToast('Title is required', 'error');
                return;
              }
              const newId = 'ch_' + Date.now();
              await supabase.from('chapters').insert({ id: newId, unit_id: unitId, chapter_name: title, description: description });
              Store.logActivity('Create Chapter', `Created Chapter: ${title}`);
              closeModal();
              showToast('Chapter created successfully', 'success');
              renderPage();
            }}
          ]
        });
      });
    });

    // Edit Chapter Action
    document.querySelectorAll('.edit-chapter').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chapterId = btn.dataset.chid;
        const chapter = Store.getChapter(chapterId);
        if (!chapter) return;

        openModal({
          title: 'Edit Chapter',
          content: `
            <div class="form-group">
              <label class="form-label">Chapter Title</label>
              <input class="form-input" id="chTitle" value="${chapter.title}">
            </div>
            <div class="form-group">
              <label class="form-label">Chapter Description</label>
              <textarea class="form-textarea" id="chDesc" rows="3">${chapter.description || ''}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Chapter Icon</label>
              <input class="form-input" id="chIcon" value="${chapter.icon || ''}">
            </div>
          `,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
            { label: 'Save Changes', class: 'btn btn-primary', onClick: async () => {
              const title = document.getElementById('chTitle').value.trim();
              const description = document.getElementById('chDesc').value.trim();
              const icon = document.getElementById('chIcon').value.trim();
              if (!title) {
                showToast('Title is required', 'error');
                return;
              }
              await supabase.from('chapters').update({ chapter_name: title, description: description }).eq('id', chapterId);
              Store.logActivity('Edit Chapter', `Updated Chapter: ${title}`);
              closeModal();
              showToast('Chapter updated successfully', 'success');
              renderPage();
            }}
          ]
        });
      });
    });

    // Delete Chapter Action
    document.querySelectorAll('.delete-chapter').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chapterId = btn.dataset.chid;
        if (await confirmModal('Delete Chapter', 'Are you sure you want to delete this chapter? All concepts inside will be lost!')) {
          const ch = Store.getChapter(chapterId);
          await supabase.from('chapters').delete().eq('id', chapterId);
          Store.logActivity('Delete Chapter', `Deleted Chapter: ${ch?.title}`);
          showToast('Chapter deleted successfully', 'success');
          renderPage();
        }
      });
    });

    // Add Concept Action
    document.querySelectorAll('.add-concept').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chapterId = btn.dataset.chid;
        openModal({
          title: 'Add Concept',
          content: `
            <div class="form-group">
              <label class="form-label">Concept Title</label>
              <input class="form-input" id="conTitle" placeholder="e.g. Light Reaction">
            </div>
            <div class="form-group">
              <label class="form-label">Concept Description</label>
              <textarea class="form-textarea" id="conDesc" rows="2" placeholder="Brief explanation of the concept..."></textarea>
            </div>
          `,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
            { label: 'Add Concept', class: 'btn btn-primary', onClick: async () => {
              const title = document.getElementById('conTitle').value.trim();
              const description = document.getElementById('conDesc').value.trim();
              if (!title) {
                showToast('Title is required', 'error');
                return;
              }
              const newId = 'con_' + Date.now();
              await supabase.from('concepts').insert({ id: newId, chapter_id: chapterId, concept_name: title, description: description });
              Store.logActivity('Create Concept', `Created Concept: ${title}`);
              closeModal();
              showToast('Concept created successfully', 'success');
              renderPage();
            }}
          ]
        });
      });
    });

    // Edit Concept Action
    document.querySelectorAll('.edit-concept').forEach(btn => {
      btn.addEventListener('click', async () => {
        const conceptId = btn.dataset.conid;
        const concept = Store.getConcept(conceptId);
        if (!concept) return;

        openModal({
          title: 'Edit Concept',
          content: `
            <div class="form-group">
              <label class="form-label">Concept Title</label>
              <input class="form-input" id="conTitle" value="${concept.title}">
            </div>
            <div class="form-group">
              <label class="form-label">Concept Description</label>
              <textarea class="form-textarea" id="conDesc" rows="2">${concept.description || ''}</textarea>
            </div>
          `,
          actions: [
            { label: 'Cancel', class: 'btn btn-ghost', onClick: () => closeModal() },
            { label: 'Save Changes', class: 'btn btn-primary', onClick: async () => {
              const title = document.getElementById('conTitle').value.trim();
              const description = document.getElementById('conDesc').value.trim();
              if (!title) {
                showToast('Title is required', 'error');
                return;
              }
              await supabase.from('concepts').update({ concept_name: title, description: description }).eq('id', conceptId);
              Store.logActivity('Edit Concept', `Updated Concept: ${title}`);
              closeModal();
              showToast('Concept updated successfully', 'success');
              renderPage();
            }}
          ]
        });
      });
    });

    // Delete Concept Action
    document.querySelectorAll('.delete-concept').forEach(btn => {
      btn.addEventListener('click', async () => {
        const conceptId = btn.dataset.conid;
        if (await confirmModal('Delete Concept', 'Are you sure you want to delete this concept?')) {
          const con = Store.getConcept(conceptId);
          await supabase.from('concepts').delete().eq('id', conceptId);
          Store.logActivity('Delete Concept', `Deleted Concept: ${con?.title}`);
          showToast('Concept deleted successfully', 'success');
          renderPage();
        }
      });
    });

    // Up/Down Shifting Event Handlers
    
    // Shift Unit
    document.querySelectorAll('.shift-unit-up, .shift-unit-down').forEach(btn => {
      btn.addEventListener('click', async () => {
        const unitId = btn.dataset.uid;
        const isUp = btn.classList.contains('shift-unit-up');
        const syllabus = Store.getSyllabus();
        
        // Find indices of units of currentClassId
        const classUnits = syllabus.filter(u => u.classId === currentClassId);
        const uIdx = classUnits.findIndex(u => u.id === unitId);
        if (uIdx === -1) return;
        
        const targetIdx = isUp ? uIdx - 1 : uIdx + 1;
        if (targetIdx < 0 || targetIdx >= classUnits.length) return;
        
        // Swap in classUnits
        const temp = classUnits[uIdx];
        classUnits[uIdx] = classUnits[targetIdx];
        classUnits[targetIdx] = temp;
        
        // Rebuild full syllabus order (mapping classUnits back into the syllabus)
        const updatedSyllabus = [];
        // First add other class units, then currentClass units in their new order
        syllabus.forEach(u => {
          if (u.classId !== currentClassId) {
            updatedSyllabus.push(u);
          }
        });
        // Insert class units at their relative position or just at the end. Since classIds are grouped (pu1, then pu2), we can just sort/insert them.
        if (currentClassId === 'pu1') {
          updatedSyllabus.unshift(...classUnits);
        } else {
          updatedSyllabus.push(...classUnits);
        }
        
        // Re-assign unit numbers if needed, or keep numbers as is. Let's just save.
        for (let i = 0; i < updatedSyllabus.length; i++) {
          await supabase.from('units').update({ order_number: i }).eq('id', updatedSyllabus[i].id);
        }
        Store.logActivity('Reorder Units', `Shifted unit ${isUp ? 'up' : 'down'}: ${temp.title}`);
        renderPage();
        showToast('Unit order updated', 'success');
      });
    });

    // Shift Chapter
    document.querySelectorAll('.shift-ch-up, .shift-ch-down').forEach(btn => {
      btn.addEventListener('click', async () => {
        const unitId = btn.dataset.uid;
        const chapterId = btn.dataset.chid;
        const isUp = btn.classList.contains('shift-ch-up');
        const syllabus = Store.getSyllabus();
        
        const unit = syllabus.find(u => u.id === unitId);
        if (!unit) return;
        
        const cIdx = unit.chapters.findIndex(c => c.id === chapterId);
        if (cIdx === -1) return;
        
        const targetIdx = isUp ? cIdx - 1 : cIdx + 1;
        if (targetIdx < 0 || targetIdx >= unit.chapters.length) return;
        
        // Swap chapters
        const temp = unit.chapters[cIdx];
        unit.chapters[cIdx] = unit.chapters[targetIdx];
        unit.chapters[targetIdx] = temp;
        
        // Re-assign order property
        unit.chapters.forEach((ch, idx) => {
          ch.order = idx + 1;
        });
        
        for (let i = 0; i < u.chapters.length; i++) {
          await supabase.from('chapters').update({ order_number: i }).eq('id', u.chapters[i].id);
        }
        Store.logActivity('Reorder Chapters', `Shifted chapter ${isUp ? 'up' : 'down'}: ${temp.title}`);
        renderPage();
        showToast('Chapter order updated', 'success');
      });
    });

    // Shift Concept
    document.querySelectorAll('.shift-con-up, .shift-con-down').forEach(btn => {
      btn.addEventListener('click', async () => {
        const chapterId = btn.dataset.chid;
        const conceptId = btn.dataset.conid;
        const isUp = btn.classList.contains('shift-con-up');
        const syllabus = Store.getSyllabus();
        
        // Find unit and chapter containing this concept
        let targetChapter = null;
        for (const u of syllabus) {
          const ch = u.chapters.find(c => c.id === chapterId);
          if (ch) {
            targetChapter = ch;
            break;
          }
        }
        
        if (!targetChapter) return;
        if (!targetChapter.concepts) targetChapter.concepts = [];
        
        const conIdx = targetChapter.concepts.findIndex(con => con.id === conceptId);
        if (conIdx === -1) return;
        
        const targetIdx = isUp ? conIdx - 1 : conIdx + 1;
        if (targetIdx < 0 || targetIdx >= targetChapter.concepts.length) return;
        
        // Swap concepts
        const temp = targetChapter.concepts[conIdx];
        targetChapter.concepts[conIdx] = targetChapter.concepts[targetIdx];
        targetChapter.concepts[targetIdx] = temp;
        
        // Reassign order
        targetChapter.concepts.forEach((con, idx) => {
          con.order = idx + 1;
        });
        
        for (let i = 0; i < ch.concepts.length; i++) {
          await supabase.from('concepts').update({ order_number: i }).eq('id', ch.concepts[i].id);
        }
        Store.logActivity('Reorder Concepts', `Shifted concept ${isUp ? 'up' : 'down'}: ${temp.title}`);
        renderPage();
        showToast('Concept order updated', 'success');
      });
    });
  }
}
