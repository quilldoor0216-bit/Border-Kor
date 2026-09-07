document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const systemAlert = document.getElementById('system-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertClose = document.getElementById('alert-close');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const glitchOverlay = document.getElementById('glitch-overlay');
    const body = document.body;

    function showMessage(msg, type = 'error') {
        if (!alertMessage || !systemAlert) return;
        alertMessage.textContent = msg;
        systemAlert.className = `modal ${type}`;
        
        const modalFooter = systemAlert.querySelector('.modal-footer');
        if (modalFooter) {
            if (type === 'success') {
                modalFooter.style.display = 'none';
            } else {
                modalFooter.style.display = '';
            }
        }

        systemAlert.classList.remove('hidden');
    }

    function closeSystemAlert() {
        if (systemAlert && !systemAlert.classList.contains('hidden')) {
            systemAlert.classList.add('hidden');
            if (usernameInput) usernameInput.focus();
        }
    }

    function transitionToDashboard() {
        if (systemAlert) systemAlert.classList.add('hidden');
        sessionStorage.setItem('borderAuth', 'true');
        document.documentElement.classList.add('is-authenticated');
        if (loginScreen) {
            loginScreen.classList.remove('active');
            loginScreen.classList.add('hidden');
        }
        if (dashboardScreen) {
            dashboardScreen.classList.add('active');
            dashboardScreen.classList.remove('hidden');
        }
    }

    // Auto-login if session exists
    if (sessionStorage.getItem('borderAuth') === 'true') {
        transitionToDashboard();
    }

    if (alertClose) {
        alertClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeSystemAlert();
        });
    }

    // Intercept Enter / Escape / Space when alert modal is visible to close it without re-submitting
    document.addEventListener('keydown', (e) => {
        if (systemAlert && !systemAlert.classList.contains('hidden')) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                closeSystemAlert();
            }
        }
    }, true);

    let failedAttempts = 0;

    const TARGET_ID = 'TEAM_R2_lead';
    const TARGET_PW = 'gkstprud1014@';

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rawId = usernameInput ? usernameInput.value.trim() : '';
            const rawPw = passwordInput ? passwordInput.value : '';

            // Strict matching: ID is TEAM_R2_lead, PW must strictly be gkstprud1014@
            const idMatched = (rawId.toLowerCase() === TARGET_ID.toLowerCase());
            const pwMatched = (rawPw === TARGET_PW);

            if (idMatched && pwMatched) {
                // Success
                showMessage('AUTHENTICATION SUCCESSFUL.', 'success');
                setTimeout(() => {
                    transitionToDashboard();
                }, 800);
            } else {
                // Failure
                failedAttempts++;

                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';

                if (failedAttempts < 5) {
                    showMessage(`아이디 또는 비밀번호가 틀렸습니다. (${failedAttempts}/5회)`, 'error');
                } else {
                    // Hide default alert
                    if (systemAlert) systemAlert.classList.add('hidden');
                    
                    // Try to go fullscreen
                    try {
                        const docElm = document.documentElement;
                        if (docElm.requestFullscreen) {
                            docElm.requestFullscreen();
                        } else if (docElm.mozRequestFullScreen) {
                            docElm.mozRequestFullScreen();
                        } else if (docElm.webkitRequestFullScreen) {
                            docElm.webkitRequestFullScreen();
                        } else if (docElm.msRequestFullscreen) {
                            docElm.msRequestFullscreen();
                        }
                    } catch(err) {}
                    
                    // Block input
                    if (usernameInput) usernameInput.disabled = true;
                    if (passwordInput) passwordInput.disabled = true;
                    const btn = loginForm.querySelector('button');
                    if (btn) btn.disabled = true;
                    
                    // Show BSOD full screen
                    const bsod = document.getElementById('bsod-fullscreen');
                    const bsodText = document.getElementById('bsod-text');
                    
                    if (bsod && bsodText) {
                        bsod.classList.remove('hidden');
                        
                        const message = "FATAL EXCEPTION: 0x00000005 (UNAUTHORIZED_ACCESS)\nBORDER_SECURITY_PROTOCOL_INITIATED\n\n> purging local user data... [OK]\n> wiping session records... [OK]\n> enforcing connection drop... [OK]\n\n[ TERMINATE PROCESS ... ";
                        bsodText.textContent = '';
                        
                        let i = 0;
                        let spinnerFrames = ['|', '/', '-', '\\'];
                        let spinnerCount = 0;
                        let spinnerMax = 30;
                        let successWait = 0;

                        const typeWriter = setInterval(() => {
                            if (i < message.length) {
                                bsodText.textContent += message.charAt(i);
                                i++;
                            } else if (spinnerCount < spinnerMax) {
                                let frame = spinnerFrames[Math.floor(spinnerCount / 2) % 4];
                                bsodText.textContent = message + frame + " ]";
                                spinnerCount++;
                            } else if (spinnerCount === spinnerMax) {
                                bsodText.textContent = message + "SUCCEEDED ]";
                                spinnerCount++;
                            } else if (successWait < 15) { 
                                successWait++;
                            } else {
                                clearInterval(typeWriter);
                                setTimeout(() => {
                                    bsod.style.backgroundColor = '#000';
                                    bsodText.innerHTML = '';
                                    const noise = bsod.querySelector('.tv-noise');
                                    if (noise) noise.style.display = 'none';
                                    bsod.classList.add('bsod-final');
                                    
                                    setTimeout(() => {
                                        try {
                                            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                                            const osc = audioCtx.createOscillator();
                                            const gain = audioCtx.createGain();
                                            osc.type = 'triangle';
                                            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
                                            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                                            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
                                            osc.connect(gain);
                                            gain.connect(audioCtx.destination);
                                            osc.start();
                                            osc.stop(audioCtx.currentTime + 1.0);
                                        } catch(e) {}

                                        bsod.style.backgroundColor = '#0000ff';
                                        bsod.style.justifyContent = 'center';
                                        bsod.style.alignItems = 'center';
                                        bsodText.style.textAlign = 'center';
                                        bsodText.innerHTML = "WARNING!<br><br>The system is either busy or access is denied.<br>Please restart your browser to continue your work.<br><br>Sorry for the inconvenience.";
                                    }, 800);
                                }, 300);
                            }
                        }, 50);
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------
    // Dashboard Navigation Logic
    // -------------------------------------------------------------
    const navItems = document.querySelectorAll('#main-nav li');
    const views = document.querySelectorAll('.content-area .view');
    const placeholderView = document.getElementById('placeholder-view');
    const placeholderTitle = document.getElementById('placeholder-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            const menuName = item.textContent;

            views.forEach(view => {
                view.classList.remove('active');
                view.classList.add('hidden');
            });

            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('active');
            } else if (placeholderView) {
                if (placeholderTitle) placeholderTitle.textContent = menuName;
                placeholderView.classList.remove('hidden');
                placeholderView.classList.add('active');
            }

            // Animate stat bars when moving to '조직 및 대원' (personnel)
            if (targetId === 'personnel') {
                const statBars = document.querySelectorAll('#personnel .stat-fill');
                statBars.forEach(bar => {
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                });

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        statBars.forEach(bar => {
                            bar.style.transition = 'width 1.5s cubic-bezier(0.1, 1, 0.2, 1)';
                            const row = bar.closest('.stat-row');
                            const input = row ? row.querySelector('.stat-val-input') : null;
                            if (input) {
                                let valStr = input.value.trim().replace('%', '');
                                if (valStr === '???' || valStr === 'NaN') {
                                    bar.style.width = '100%';
                                } else {
                                    let val = parseInt(valStr);
                                    if (isNaN(val)) val = 0;
                                    bar.style.width = val + '%';
                                }
                            }
                        });
                    }, 50);
                });
            }
        });
    });

    // -------------------------------------------------------------
    // More Dropdown Menu
    // -------------------------------------------------------------
    const moreMenuBtn = document.getElementById('more-menu-btn');
    const moreDropdown = document.getElementById('more-dropdown');

    if (moreMenuBtn && moreDropdown) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreDropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!moreDropdown.contains(e.target) && e.target !== moreMenuBtn) {
                moreDropdown.classList.remove('open');
            }
        });
    }

    // Close sidebar button
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    if (closeSidebarBtn && moreDropdown) {
        closeSidebarBtn.addEventListener('click', () => {
            moreDropdown.classList.remove('open');
        });
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('borderAuth');
            location.reload();
        });
    }

    // -------------------------------------------------------------
    // Quick Actions Navigation (Dashboard)
    // -------------------------------------------------------------
    const btnQuickUpload = document.getElementById('btn-quick-upload');
    if (btnQuickUpload) {
        btnQuickUpload.addEventListener('click', () => {
            const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'reports');
            if (targetNav) targetNav.click();
        });
    }

    const btnEditStats = document.getElementById('btn-edit-stats');
    if (btnEditStats) {
        btnEditStats.addEventListener('click', () => {
            const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'personnel');
            if (targetNav) targetNav.click();
        });
    }

    const updateStat = (input) => {
        const row = input.closest('.stat-row');
        if (!row) return;
        const barFill = row.querySelector('.stat-fill');
        
        if (input && barFill) {
            let rawVal = input.value.trim().replace('%', '');
            let displayVal = '';
            let widthVal = 0;
            let stateClass = '';

            if (rawVal === '???' || rawVal === 'NaN') {
                displayVal = '???';
                widthVal = 100;
                stateClass = 'danger text-danger';
                barFill.className = 'stat-fill bg-danger';
            } else {
                let numVal = parseInt(rawVal);
                if (isNaN(numVal)) numVal = 0;
                if (numVal > 100) numVal = 100;
                if (numVal < 0) numVal = 0;
                
                displayVal = numVal + '%';
                widthVal = numVal;
                
                if (numVal <= 10) stateClass = 'critical';
                else if (numVal <= 30) stateClass = 'danger';
                else if (numVal <= 50) stateClass = 'orange';
                else if (numVal <= 70) stateClass = 'warning';
                else stateClass = 'success';
                
                barFill.className = `stat-fill bg-${stateClass}`;
            }

            input.value = displayVal;
            barFill.style.width = widthVal + '%';
            
            input.className = 'stat-val-input';
            if (stateClass === 'critical') input.classList.add('text-critical');
            else if (stateClass === 'danger' || stateClass.includes('danger')) input.classList.add('text-danger');
            else if (stateClass === 'orange') input.classList.add('text-orange');
            else if (stateClass === 'warning') input.classList.add('text-warning');
            else input.classList.add('text-success');

            if (typeof updateTeamStatus === 'function') {
                updateTeamStatus();
            }
        }
    };

    document.querySelectorAll('.stat-val-input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
        input.addEventListener('blur', () => {
            updateStat(input);
        });
        input.addEventListener('input', () => {
            if (typeof updateTeamStatus === 'function') {
                updateTeamStatus();
            }
        });
    });

    // -------------------------------------------------------------
    // Incident Input Autocomplete in Report
    // -------------------------------------------------------------
    const incNumInput = document.getElementById('inc-num-input');
    const apDisplay = document.getElementById('ap-display');
    const acDisplay = document.getElementById('ac-display');

    if (incNumInput) {
        incNumInput.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (apDisplay) apDisplay.value = val || '';
            if (acDisplay) acDisplay.value = val || '';
        });
    }

    // -------------------------------------------------------------
    // Helper: Grade Badge Generator
    // -------------------------------------------------------------
    function getGradeBadge(grade) {
        if (!grade) return '<span class="badge badge-dark">미지정</span>';
        if (grade.includes('흑') || grade.toLowerCase().includes('black')) {
            return '<span class="badge badge-grade-black">흑 (Black)</span>';
        } else if (grade.includes('적') || grade.toLowerCase().includes('red')) {
            return '<span class="badge badge-grade-red">적 (Red)</span>';
        } else if (grade.includes('황') || grade.toLowerCase().includes('yellow')) {
            return '<span class="badge badge-grade-yellow">황 (Yellow)</span>';
        } else if (grade.includes('녹') || grade.toLowerCase().includes('green')) {
            return '<span class="badge badge-grade-green">녹 (Green)</span>';
        } else if (grade.includes('청') || grade.toLowerCase().includes('blue')) {
            return '<span class="badge badge-grade-blue">청 (Blue)</span>';
        }
        return `<span class="badge badge-dark">${grade}</span>`;
    }

    // -------------------------------------------------------------
    // Helper: Extract Summary from Frozen Report HTML
    // -------------------------------------------------------------
    function extractSummaryFromFrozen(container) {
        let incNum = '';
        let title = '현장 조치 및 구조 작전 보고서';
        let author = '';
        let date = '';
        let grade = '흑';

        const fields = container.querySelectorAll('.doc-field, .doc-field-block');
        fields.forEach(f => {
            const lbl = f.querySelector('label');
            const valEl = f.querySelector('.frozen-val');
            if (!lbl || !valEl) return;
            const text = lbl.textContent;
            const val = valEl.textContent.trim();
            
            if (text.includes('사건 번호') || text.includes('사건번호')) {
                incNum = val;
            } else if (text.includes('작성자')) {
                author = val;
            } else if (text.includes('출동 요청 일시') || text.includes('발생 일시') || text.includes('작성 일시')) {
                if (!date || text.includes('출동 요청 일시')) {
                    date = val;
                }
            }
        });

        // Extract grade from entity grade section
        const gradeBlock = Array.from(container.querySelectorAll('.doc-field-block, .doc-row')).find(b => {
            const lbl = b.querySelector('label');
            return lbl && (lbl.textContent.includes('개체 등급') || lbl.textContent.includes('개체등급'));
        });

        if (gradeBlock) {
            const checkedSpan = Array.from(gradeBlock.querySelectorAll('.frozen-chk')).find(chk => chk.textContent.includes('☑'));
            if (checkedSpan && checkedSpan.parentElement) {
                grade = checkedSpan.parentElement.textContent.trim().replace('☑', '').trim();
            }
        }

        return {
            incNum: incNum || '-',
            title: title,
            author: author || '-',
            date: date || '-',
            grade: grade
        };
    }

    // -------------------------------------------------------------
    // Rescue Report Form & Incident Log Logic
    // -------------------------------------------------------------
    const rescueReportForm = document.getElementById('rescue-report-form');
    const reportSubmitBtn = document.getElementById('report-submit-btn');
    const incidentLogsTbody = document.querySelector('#incident-logs tbody');
    const readonlyModal = document.getElementById('readonly-modal');
    const readonlyBody = document.getElementById('readonly-body');
    const closeReadonlyBtn = document.getElementById('close-readonly-btn');

    if (closeReadonlyBtn && readonlyModal) {
        closeReadonlyBtn.addEventListener('click', () => {
            readonlyModal.classList.add('hidden');
        });
    }

    if (rescueReportForm) {
        rescueReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            showMessage('보고서를 암호화하여 서버에 전송 중입니다...', 'warning');
            
            setTimeout(() => {
                showMessage('보고서 등록이 완료되었습니다.', 'success');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 2000);
                
                // Freeze form HTML
                const clone = rescueReportForm.cloneNode(true);
                
                // Process inputs & selects
                const inputs = Array.from(rescueReportForm.querySelectorAll('input[type="text"], select'));
                const cloneInputs = Array.from(clone.querySelectorAll('input[type="text"]'));
                inputs.forEach((input, i) => {
                    const span = document.createElement('span');
                    span.textContent = input.value || ' ';
                    span.className = 'frozen-val';
                    span.style.padding = '0 10px';
                    span.style.display = 'inline-block';
                    span.style.minWidth = '100px';
                    if (cloneInputs[i] && cloneInputs[i].parentNode) {
                        cloneInputs[i].parentNode.replaceChild(span, cloneInputs[i]);
                    }
                });

                // Process radios & checkboxes
                const checks = Array.from(rescueReportForm.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
                const cloneChecks = Array.from(clone.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
                checks.forEach((chk, i) => {
                    const span = document.createElement('span');
                    span.className = 'frozen-chk';
                    span.textContent = chk.checked ? '☑ ' : '☐ ';
                    span.style.color = chk.checked ? 'var(--success)' : '#777';
                    span.style.fontWeight = 'bold';
                    span.style.marginRight = '4px';
                    if (cloneChecks[i] && cloneChecks[i].parentNode) {
                        cloneChecks[i].parentNode.replaceChild(span, cloneChecks[i]);
                    }
                });

                // Process textareas
                const textareas = Array.from(rescueReportForm.querySelectorAll('textarea'));
                const cloneTextareas = Array.from(clone.querySelectorAll('textarea'));
                textareas.forEach((ta, i) => {
                    const div = document.createElement('div');
                    div.className = 'frozen-val';
                    div.style.whiteSpace = 'pre-wrap';
                    div.style.padding = '10px';
                    div.style.background = 'rgba(255,255,255,0.03)';
                    div.style.border = '1px solid #333';
                    div.style.borderRadius = '4px';
                    div.style.marginTop = '5px';
                    div.textContent = ta.value || '(내용 없음)';
                    if (cloneTextareas[i] && cloneTextareas[i].parentNode) {
                        cloneTextareas[i].parentNode.replaceChild(div, cloneTextareas[i]);
                    }
                });

                // Remove submit buttons from clone
                clone.querySelectorAll('button').forEach(b => b.remove());

                // Create incident logs table row (5 columns: 식별번호 | 제목 | 작성자 | 발생 일시 | 개체 등급)
                const incNum = (incNumInput ? incNumInput.value.trim() : '') || '-';
                const titleInput = rescueReportForm.querySelector('.doc-field input');
                const title = (titleInput ? titleInput.value.trim() : '') || '현장 조치 및 구조 작전 보고서';
                const authorInput = document.getElementById('author-input');
                const author = (authorInput ? authorInput.value.trim() : '') || '-';
                const dateInput = document.getElementById('dispatch-req-date');
                const date = (dateInput ? dateInput.value.trim() : '') || '-';
                
                const checkedGrade = rescueReportForm.querySelector('input[name="entity_grade"]:checked');
                const gradeVal = checkedGrade ? checkedGrade.value : '흑';

                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.innerHTML = `
                    <td>${incNum}</td>
                    <td>${title}</td>
                    <td>${author}</td>
                    <td>${date}</td>
                    <td>${getGradeBadge(gradeVal)}</td>
                `;
                
                tr.dataset.frozen = clone.innerHTML;
                
                tr.addEventListener('click', () => {
                    window.currentViewingRow = tr;
                    if (readonlyBody) readonlyBody.innerHTML = tr.dataset.frozen;
                    const editBtn = document.getElementById('edit-report-btn');
                    if (editBtn) {
                        const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
                        editBtn.innerHTML = pencilSvg;
                        editBtn.title = '수정';
                    }
                    if (readonlyModal) readonlyModal.classList.remove('hidden');
                });

                if (incidentLogsTbody) {
                    const firstRow = incidentLogsTbody.querySelector('tr');
                    if (firstRow && firstRow.textContent.includes('없습니다')) {
                        firstRow.remove();
                    }
                    incidentLogsTbody.insertAdjacentElement('afterbegin', tr);
                }

                saveReportsToLocal();
                
                // Switch to incident logs tab
                const targetNav = Array.from(document.querySelectorAll('#main-nav li')).find(li => li.getAttribute('data-target') === 'incident-logs');
                if (targetNav) targetNav.click();
                
                // Reset form
                rescueReportForm.reset();
                if (apDisplay) apDisplay.value = '';
                if (acDisplay) acDisplay.value = '';
                
            }, 800);
        });
    }

    if (reportSubmitBtn && rescueReportForm) {
        reportSubmitBtn.addEventListener('click', () => {
            if (typeof rescueReportForm.requestSubmit === 'function') {
                rescueReportForm.requestSubmit();
            } else {
                rescueReportForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        });
    }

    const deleteBtn = document.getElementById('delete-report-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('이 보고서를 영구 삭제하시겠습니까?')) {
                if (window.currentViewingRow) {
                    window.currentViewingRow.remove();
                    saveReportsToLocal();
                }
                if (readonlyModal) readonlyModal.classList.add('hidden');
                showMessage('보고서가 삭제되었습니다.', 'warning');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 2000);
            }
        });
    }

    const editBtn = document.getElementById('edit-report-btn');
    if (editBtn) {
        let isEditingMode = false;
        const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
        const saveSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
        
        function toggleCheckbox(chkSpan) {
            const parentGroup = chkSpan.closest('.doc-check-group');
            const isRadioGroup = parentGroup && (
                (parentGroup.previousElementSibling && (parentGroup.previousElementSibling.textContent.includes('등급') || parentGroup.previousElementSibling.textContent.includes('상태'))) ||
                (parentGroup.parentElement && (parentGroup.parentElement.textContent.includes('등급') || parentGroup.parentElement.textContent.includes('상태')))
            );
            
            if (isRadioGroup) {
                parentGroup.querySelectorAll('.frozen-chk').forEach(s => {
                    s.textContent = '☐ ';
                    s.style.color = '#777';
                });
                chkSpan.textContent = '☑ ';
                chkSpan.style.color = 'var(--success)';
            } else {
                const isChecked = chkSpan.textContent.includes('☑');
                if (isChecked) {
                    chkSpan.textContent = '☐ ';
                    chkSpan.style.color = '#777';
                } else {
                    chkSpan.textContent = '☑ ';
                    chkSpan.style.color = 'var(--success)';
                }
            }
        }

        editBtn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            if (isEditingMode) {
                // Save mode
                if (readonlyBody) {
                    const vals = readonlyBody.querySelectorAll('.frozen-val');
                    vals.forEach(v => {
                        v.contentEditable = false;
                        v.style.backgroundColor = 'transparent';
                        v.style.border = v.dataset.oldBorder || 'none';
                    });
                    
                    const checks = readonlyBody.querySelectorAll('.frozen-chk');
                    checks.forEach(c => {
                        c.style.cursor = 'default';
                        c.style.color = c.textContent.includes('☑') ? 'var(--success)' : '#777';
                        c.onclick = null;
                        if (c.parentElement && c.parentElement.tagName.toLowerCase() === 'label') {
                            c.parentElement.style.cursor = 'default';
                            c.parentElement.onclick = null;
                        }
                    });
                }
                targetBtn.innerHTML = pencilSvg;
                targetBtn.title = '수정';
                isEditingMode = false;
                
                if (window.currentViewingRow && readonlyBody) {
                    window.currentViewingRow.dataset.frozen = readonlyBody.innerHTML;
                    
                    // Immediately update visible table row columns with edited data
                    const summary = extractSummaryFromFrozen(readonlyBody);
                    window.currentViewingRow.innerHTML = `
                        <td>${summary.incNum}</td>
                        <td>${summary.title}</td>
                        <td>${summary.author}</td>
                        <td>${summary.date}</td>
                        <td>${getGradeBadge(summary.grade)}</td>
                    `;
                    
                    saveReportsToLocal();
                }
                showMessage('수정 사항이 저장되었습니다.', 'success');
                setTimeout(() => {
                    if (systemAlert) systemAlert.classList.add('hidden');
                }, 1500);
            } else {
                // Edit mode
                if (readonlyBody) {
                    const vals = readonlyBody.querySelectorAll('.frozen-val');
                    vals.forEach(v => {
                        v.contentEditable = true;
                        v.dataset.oldBorder = v.style.border;
                        v.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        v.style.border = '1px dashed #aaa';
                        v.style.outline = 'none';
                    });
                    
                    const checks = readonlyBody.querySelectorAll('.frozen-chk');
                    checks.forEach(c => {
                        c.style.cursor = 'pointer';
                        c.style.userSelect = 'none';
                        if (c.parentElement && c.parentElement.tagName.toLowerCase() === 'label') {
                            c.parentElement.style.cursor = 'pointer';
                            c.parentElement.style.userSelect = 'none';
                            c.parentElement.onclick = function(ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleCheckbox(c);
                            };
                        } else {
                            c.onclick = function(ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                toggleCheckbox(c);
                            };
                        }
                    });
                }
                targetBtn.innerHTML = saveSvg;
                targetBtn.title = '저장';
                isEditingMode = true;
            }
        });
        
        if (closeReadonlyBtn) {
            closeReadonlyBtn.addEventListener('click', () => {
                isEditingMode = false;
                editBtn.innerHTML = pencilSvg;
                editBtn.title = '수정';
            });
        }
    }

    // -------------------------------------------------------------
    // Dynamic Anomalies & Entities Generation & Search
    // -------------------------------------------------------------
    const anomaliesContainer = document.getElementById('anomalies-list-container');
    const entitiesContainer = document.getElementById('entities-list-container');
    
    const annotations = {
        97: '<span style="margin-left: 10px; color: #d500f9; font-weight: bold;">[N-01]</span>',
        200: '<span style="margin-left: 10px; color: #ffea00; font-weight: bold;">[D-01]</span>',
        333: '<span style="margin-left: 10px; color: #2196f3; font-weight: bold;">[구조 2팀]</span>',
        781: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀/팀장]</span>',
        793: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        821: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        866: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 1팀]</span>',
        1079: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>',
        1111: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>',
        1144: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀/팀장]</span>',
        1218: '<span style="margin-left: 10px; color: #4caf50; font-weight: bold;">[처리 2팀]</span>'
    };

    const generateRows = (prefix, maxCount = 3110) => {
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= maxCount; i++) {
            const div = document.createElement('div');
            const paddedNum = i.toString().padStart(4, '0');
            div.id = `${prefix}-${paddedNum}`;
            div.className = 'db-row';
            div.style.padding = '8px 15px';
            div.style.borderBottom = '1px solid var(--border-color)';
            div.style.color = 'var(--text-primary)';
            div.style.fontFamily = 'monospace';
            div.style.fontSize = '15px';
            
            const anno = annotations[i] || '';
            const isTeam = anno.includes('처리') || anno.includes('구조');
            const nameHtml = isTeam 
                ? `<strong style="font-weight: 800; color: #ffffff;">BORDER - KR - ${paddedNum}</strong>` 
                : `BORDER - KR - ${paddedNum}`;
            div.innerHTML = `${nameHtml}${anno}`;
            fragment.appendChild(div);
        }
        return fragment;
    };

    if (anomaliesContainer) {
        anomaliesContainer.innerHTML = '';
        anomaliesContainer.appendChild(generateRows('anom', 1286));
    }
    if (entitiesContainer) {
        entitiesContainer.innerHTML = '';
        entitiesContainer.appendChild(generateRows('ent', 1286));
    }

    const searchAnom = document.getElementById('search-anom');
    if (searchAnom) {
        searchAnom.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchAnom.value.trim();
                let numMatch = query.match(/\d+/);
                if (numMatch) {
                    let num = parseInt(numMatch[0]);
                    let paddedNum = num.toString().padStart(4, '0');
                    let targetId = 'anom-' + paddedNum;
                    let targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        document.querySelectorAll('#anomalies .db-row').forEach(row => row.style.backgroundColor = '');
                        targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        setTimeout(() => {
                            targetEl.style.transition = 'background-color 1s';
                            targetEl.style.backgroundColor = '';
                            setTimeout(() => { targetEl.style.transition = ''; }, 1000);
                        }, 1000);
                    }
                }
            }
        });
    }

    const searchEnt = document.getElementById('search-ent');
    if (searchEnt) {
        searchEnt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchEnt.value.trim();
                let numMatch = query.match(/\d+/);
                if (numMatch) {
                    let num = parseInt(numMatch[0]);
                    let paddedNum = num.toString().padStart(4, '0');
                    let targetId = 'ent-' + paddedNum;
                    let targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        document.querySelectorAll('#entity-logs .db-row').forEach(row => row.style.backgroundColor = '');
                        targetEl.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        setTimeout(() => {
                            targetEl.style.transition = 'background-color 1s';
                            targetEl.style.backgroundColor = '';
                            setTimeout(() => { targetEl.style.transition = ''; }, 1000);
                        }, 1000);
                    }
                }
            }
        });
    }

    // Initial team status update
    if (typeof updateTeamStatus === 'function') {
        updateTeamStatus();
    }
});

// Auto-resize textareas
document.addEventListener('input', function (event) {
    if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'textarea') {
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight) + 'px';
    }
}, false);

// Persistent Local Storage Logic for Reports
function saveReportsToLocal() {
    const logTableBody = document.querySelector('#incident-logs tbody');
    if (!logTableBody) return;
    const rows = logTableBody.querySelectorAll('tr');
    const reports = [];
    rows.forEach(tr => {
        if (tr.querySelector('td[colspan]')) return;
        const cols = tr.querySelectorAll('td');
        if (cols.length >= 5) {
            reports.push({
                incNum: cols[0].textContent.trim(),
                title: cols[1].textContent.trim(),
                author: cols[2].textContent.trim(),
                date: cols[3].textContent.trim(),
                gradeHtml: cols[4].innerHTML.trim(),
                frozenHtml: tr.dataset.frozen || ''
            });
        }
    });
    localStorage.setItem('border_reports', JSON.stringify(reports));
}

function loadReportsFromLocal() {
    const saved = localStorage.getItem('border_reports');
    if (!saved) return;
    
    try {
        const reports = JSON.parse(saved);
        if (!Array.isArray(reports) || reports.length === 0) return;
        
        const logTableBody = document.querySelector('#incident-logs tbody');
        if (!logTableBody) return;
        logTableBody.innerHTML = '';
        
        const readonlyBody = document.getElementById('readonly-body');
        const readonlyModal = document.getElementById('readonly-modal');
        
        function getGradeBadgeLocal(grade) {
            if (!grade) return '<span class="badge badge-dark">미지정</span>';
            if (grade.includes('흑') || grade.toLowerCase().includes('black')) {
                return '<span class="badge badge-grade-black">흑 (Black)</span>';
            } else if (grade.includes('적') || grade.toLowerCase().includes('red')) {
                return '<span class="badge badge-grade-red">적 (Red)</span>';
            } else if (grade.includes('황') || grade.toLowerCase().includes('yellow')) {
                return '<span class="badge badge-grade-yellow">황 (Yellow)</span>';
            } else if (grade.includes('녹') || grade.toLowerCase().includes('green')) {
                return '<span class="badge badge-grade-green">녹 (Green)</span>';
            } else if (grade.includes('청') || grade.toLowerCase().includes('blue')) {
                return '<span class="badge badge-grade-blue">청 (Blue)</span>';
            }
            return `<span class="badge badge-dark">${grade}</span>`;
        }

        reports.forEach(data => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            
            let incNum = data.incNum || '';
            let title = data.title || '';
            let author = data.author || '';
            let date = data.date || '';
            let gradeHtml = data.gradeHtml || '';

            // Migrate legacy unstructured entries
            if (data.innerHTML && !data.incNum) {
                const tempTr = document.createElement('tr');
                tempTr.innerHTML = data.innerHTML;
                const cols = tempTr.querySelectorAll('td');
                if (cols.length >= 5) {
                    incNum = cols[0].textContent.trim();
                    title = cols[1].textContent.trim();
                    if (cols[2].textContent.includes('202') || cols[2].textContent.includes('-')) {
                        date = cols[2].textContent.trim();
                        author = cols[3].textContent.trim();
                    } else {
                        author = cols[2].textContent.trim();
                        date = cols[3].textContent.trim();
                    }
                    gradeHtml = cols[4].innerHTML.trim();
                }
            }

            // Fix any gradeHtml that had '완료' or '최종'
            if (gradeHtml.includes('완료') || gradeHtml.includes('최종') || !gradeHtml) {
                let extractedGrade = '청 (Blue)';
                if (data.frozenHtml) {
                    if (data.frozenHtml.includes('value="청"') && data.frozenHtml.includes('checked')) extractedGrade = '청 (Blue)';
                    else if (data.frozenHtml.includes('value="적"') && data.frozenHtml.includes('checked')) extractedGrade = '적 (Red)';
                    else if (data.frozenHtml.includes('value="황"') && data.frozenHtml.includes('checked')) extractedGrade = '황 (Yellow)';
                    else if (data.frozenHtml.includes('value="녹"') && data.frozenHtml.includes('checked')) extractedGrade = '녹 (Green)';
                    else if (data.frozenHtml.includes('value="흑"') && data.frozenHtml.includes('checked')) extractedGrade = '흑 (Black)';
                }
                gradeHtml = getGradeBadgeLocal(extractedGrade);
            }

            tr.innerHTML = `
                <td>${incNum}</td>
                <td>${title}</td>
                <td>${author}</td>
                <td>${date}</td>
                <td>${gradeHtml}</td>
            `;
            tr.dataset.frozen = data.frozenHtml || '';
            
            tr.addEventListener('click', () => {
                window.currentViewingRow = tr;
                if (readonlyBody) readonlyBody.innerHTML = tr.dataset.frozen;
                const editBtn = document.getElementById('edit-report-btn');
                if (editBtn) {
                    const pencilSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
                    editBtn.innerHTML = pencilSvg;
                    editBtn.title = '수정';
                }
                if (readonlyModal) readonlyModal.classList.remove('hidden');
            });
            
            logTableBody.appendChild(tr);
        });
    } catch(e) {
        console.error('Failed to load reports', e);
    }
}

document.addEventListener('DOMContentLoaded', loadReportsFromLocal);

// -------------------------------------------------------------
// Team Status Dynamic Update Function
// -------------------------------------------------------------
function updateTeamStatus() {
    try {
        const teamStatusSection = document.getElementById('team-status');
        if (!teamStatusSection) return;
        
        const statCards = teamStatusSection.querySelectorAll('.stat-card .value');
        if (statCards.length < 4) return;
        
        const tsStatusText = statCards[1];
        const tsTotalText = statCards[2];
        const tsDeployText = statCards[3];
        
        const cards = document.querySelectorAll('#personnel .person-card');
        let totalMembers = cards.length;
        let deployableMembers = totalMembers;
        let minStat = 100;
        let mutatedNames = [];
        let injuredNames = [];

        cards.forEach(card => {
            const nameEl = card.querySelector('.person-header h4') || card.querySelector('.p-name');
            const name = nameEl ? nameEl.textContent.trim() : '대원';
            const inputs = card.querySelectorAll('.stat-val-input');
            let isCorrupted = false;
            let cardMin = 100;

            inputs.forEach(input => {
                const row = input.closest('.stat-row');
                const label = row ? (row.querySelector('label') || row.querySelector('.stat-label')) : null;
                const barFill = row ? row.querySelector('.stat-fill') : null;
                let valStr = input.value.trim().replace('%', '');

                if (valStr === '???' || valStr === 'NaN') {
                    isCorrupted = true;
                    if (barFill) {
                        barFill.className = 'stat-fill bg-danger';
                        barFill.style.width = '100%';
                    }
                    input.className = 'stat-val-input text-danger';
                } else {
                    let val = parseInt(valStr);
                    if (isNaN(val)) val = 0;
                    if (val > 100) val = 100;
                    if (val < 0) val = 0;

                    let statClass = 'success';
                    if (val <= 10) statClass = 'critical';
                    else if (val <= 30) statClass = 'danger';
                    else if (val <= 50) statClass = 'orange';
                    else if (val <= 70) statClass = 'warning';

                    if (barFill) {
                        barFill.className = `stat-fill bg-${statClass}`;
                        barFill.style.width = val + '%';
                    }

                    input.className = 'stat-val-input';
                    if (statClass === 'critical') input.classList.add('text-critical');
                    else if (statClass === 'danger') input.classList.add('text-danger');
                    else if (statClass === 'orange') input.classList.add('text-orange');
                    else if (statClass === 'warning') input.classList.add('text-warning');
                    else input.classList.add('text-success');

                    // James exception for mental stat
                    let effectiveVal = val;
                    if (name.includes('제임스') && label && label.textContent.includes('정신') && val === 50) {
                        effectiveVal = 70;
                    }

                    if (effectiveVal < cardMin) {
                        cardMin = effectiveVal;
                    }
                    if (effectiveVal < minStat) {
                        minStat = effectiveVal;
                    }
                }
            });

            if (isCorrupted) {
                mutatedNames.push(name);
                deployableMembers--;
            } else if (cardMin < 70) {
                injuredNames.push(name);
                deployableMembers--;
            }
        });

        tsStatusText.className = 'value';

        if (mutatedNames.length > 0) {
            tsStatusText.classList.add('text-danger');
            let text = mutatedNames.length === 1 ? mutatedNames[0] + ' 변질' : mutatedNames[0] + ' 외 ' + (mutatedNames.length - 1) + '명 변질';
            tsStatusText.textContent = text;
        } else if (injuredNames.length > 0) {
            tsStatusText.classList.add('text-warning');
            let text = injuredNames.length === 1 ? injuredNames[0] + ' 부상' : injuredNames[0] + ' 외 ' + (injuredNames.length - 1) + '명 부상';
            tsStatusText.textContent = text;
        } else if (minStat >= 70) {
            tsStatusText.classList.add('text-success');
            tsStatusText.textContent = '작전 가능';
        } else if (minStat >= 40) {
            tsStatusText.classList.add('text-warning');
            tsStatusText.textContent = '주의 요망';
        } else {
            tsStatusText.classList.add('text-danger');
            tsStatusText.textContent = '작전 불가';
        }

        if (tsTotalText) tsTotalText.textContent = totalMembers + '명';
        if (tsDeployText) tsDeployText.textContent = deployableMembers + '명';
    } catch(e) {
        console.error('updateTeamStatus error:', e);
    }
}
