from loadCSVs import qca_list_download

def test_qca_list_download():
    year_group = "2026"
    assert qca_list_download(year_group) == "csvDownloads\\qca_list_2026.csv"

test_qca_list_download()
print("Test passed")